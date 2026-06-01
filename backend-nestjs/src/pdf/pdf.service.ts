import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Repair } from '../repair/entities/repair.entity';
import { Company } from 'src/company/entities/company.entity';
import { Legislation } from 'src/legislation/entities/legislation.entity';

@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Legislation)
    private readonly legislationRepository: Repository<Legislation>,
    @InjectRepository(Repair)
    private readonly repairRepository: Repository<Repair>,
  ) {}

  async generatRepairPdf(repair: Repair): Promise<Buffer> {
    if (!repair?.device?.model) {
      throw new BadRequestException('Repair device or model missing');
    }

    const doc = new PDFDocument({ margin: 15, size: 'A4' });
    const buffers: Buffer[] = [];
    doc.on('data', (b) => buffers.push(b));

    const firstHistory = repair.historyRepair?.[0];
    const firstTrace = firstHistory?.tracability?.[0];
    const branch = firstTrace?.user?.branch;
    const company = branch?.company?.id
      ? await this.companyRepository.findOne({ where: { id: branch.company.id } })
      : null;
    const model = repair.device.model;
    const brand = model?.brand;
    const customer = repair.customer;
    const distributer = customer?.distributer;

    const legislations = await this.legislationRepository.find();

    const previousRepairs = repair.device?.serialenumber
      ? await this.repairRepository.find({
          where: { device: { serialenumber: repair.device.serialenumber } },
          relations: ['historyRepair', 'historyRepair.tracability', 'historyRepair.tracability.user'],
        })
      : [];
    const filteredPrevious = previousRepairs.filter(r => r.id !== repair.id);

    const safeDateTime = (d?: Date) =>
      d
        ? new Date(d).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'N/A';

    const pageWidth = doc.page.width - 30;
    const ml = 15;
    const fsN = 7;
    const fsS = 6.5;

    const tryImage = (filePath: string, x: number, y: number, w: number) => {
      try {
        if (fs.existsSync(filePath)) { doc.image(filePath, x, y, { width: w }); return true; }
      } catch {}
      return false;
    };

    const drawSection = (y0: number, isSociete: boolean, title: string): number => {
      let y = y0;

      // Title
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#135188')
        .text(title, ml, y, { width: pageWidth, align: 'center' });
      y += 12;

      // Logos: company left, brand right
      const logoSize = 30;
      if (company?.logo) {
        const p = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
        tryImage(p, ml, y, logoSize);
      }
      if (brand?.logo) {
        const p = path.join(__dirname, '..', '..', 'upload', 'brands', brand.logo);
        tryImage(p, ml + pageWidth - logoSize, y, logoSize);
      }
      y += logoSize + 6;

      // Combined info box with 3 columns
      const bx = ml;
      const by = y;
      const bw = pageWidth;
      const colW = (bw - 10) / 3;
      const c1x = bx + 5;
      const c2x = bx + 5 + colW + 5;
      const c3x = bx + 5 + 2 * (colW + 5);

      // Column 1: Repair info
      let c1y = by + 5;
      doc.fontSize(fsN).font('Helvetica-Bold').text('Réparation:', c1x, c1y);
      c1y += 9;
      doc.font('Helvetica');
      [
        `N°: ${repair.id}`,
        `Date: ${safeDateTime(firstHistory?.date)}`,
        `Étape: ${firstHistory?.step ?? '-'}`,
        `Technicien: ${firstTrace?.user?.name ?? '-'}`,
        `Agence: ${branch?.name ?? '-'}`,
        `Tél agence: ${branch?.phone?.toString() ?? '-'}`,
      ].forEach(t => { doc.text(t, c1x + 3, c1y); c1y += 7; });

      // Column 2: Device info
      let c2y = by + 5;
      doc.font('Helvetica-Bold').text('Appareil:', c2x, c2y);
      c2y += 9;
      doc.font('Helvetica');
      [
        `N° série: ${repair.device?.serialenumber ?? '-'}`,
        `Marque: ${brand?.name ?? '-'}`,
        `Modèle: ${model?.name ?? '-'}`,
        `Type: ${model?.typeModel?.description ?? '-'}`,
        `État reçu: ${repair.deviceStateReceive ?? '-'}`,
      ].forEach(t => { doc.text(t, c2x + 3, c2y); c2y += 7; });

      // Column 3: Customer info
      let c3y = by + 5;
      doc.font('Helvetica-Bold').text('Client:', c3x, c3y);
      c3y += 9;
      doc.font('Helvetica');
      [
        `Nom: ${customer?.name ?? '-'}`,
        `Tél: ${customer?.phone?.toString() ?? '-'}`,
        `Distributeur: ${distributer?.name ?? '-'}`,
      ].forEach(t => { doc.text(t, c3x + 3, c3y); c3y += 7; });

      const boxEnd = Math.max(c1y, c2y, c3y, by + 50);
      doc.rect(bx, by, bw, boxEnd - by).stroke();
      y = boxEnd + 4;

      // Accessories
      doc.fontSize(fsN).font('Helvetica-Bold').text('Accessoires:', bx + 5, y);
      doc.font('Helvetica');
      const acc = repair.accessory?.length ? repair.accessory.map(a => a.name).join(', ') : 'Aucun';
      doc.text(acc, bx + 62, y, { width: pageWidth - 80 });
      y += 10;

      // Faults
      doc.font('Helvetica-Bold').text('Pannes:', bx + 5, y);
      doc.font('Helvetica');
      const flt = repair.listFault?.length ? repair.listFault.map(f => f.name).join(', ') : 'Aucune';
      doc.text(flt, bx + 42, y, { width: pageWidth - 60 });
      y += 10;

      // Customer requests
      doc.font('Helvetica-Bold').text('Demandes client:', bx + 5, y);
      doc.font('Helvetica');
      const req = repair.customerRequest?.length ? repair.customerRequest.map(r => r.name).join(', ') : 'Aucune';
      doc.text(req, bx + 82, y, { width: pageWidth - 100 });
      y += 10;

      // Section-specific content
      if (isSociete && filteredPrevious.length > 0) {
        y += 2;
        doc.font('Helvetica-Bold').fontSize(fsN).fillColor('#135188')
          .text('Réparations antérieures:', bx + 5, y);
        y += 8;
        doc.font('Helvetica').fillColor('black').fontSize(fsS);
        filteredPrevious.slice(0, 5).forEach((prev, i) => {
          const ph = prev.historyRepair?.[0];
          const pt = ph?.tracability?.[0];
          doc.text(
            `${i + 1}. N°${prev.id} - ${safeDateTime(ph?.date)} - ${ph?.step ?? '-'} (${pt?.user?.name ?? '-'})`,
            bx + 10, y
          );
          y += 7;
        });
        y += 2;
      }

      if (!isSociete) {
        y += 2;
        doc.font('Helvetica-Bold').fontSize(fsN).fillColor('#135188')
          .text('Législations:', bx + 5, y);
        y += 8;
        doc.font('Helvetica').fillColor('black').fontSize(fsS);
        const nCol = 3;
        const cw = (bw - 30) / nCol;
        const legRows = Math.ceil(legislations.length / nCol);
        legislations.forEach((leg, i) => {
          const col = i % nCol;
          const row = Math.floor(i / nCol);
          doc.text(`☐ ${leg.name}`, bx + 10 + col * cw, y + row * 7, { width: cw - 5 });
        });
        y += legRows * 7 + 6;

        doc.font('Helvetica-Bold').fontSize(fsN).fillColor('#135188')
          .text('Société / Agence:', bx + 5, y);
        y += 8;
        doc.font('Helvetica').fillColor('black').fontSize(fsS);
        [
          `Société: ${company?.name ?? '-'}`,
          `Adresse: ${company?.headquarterslocation ?? '-'}`,
          `N° fiscal: ${company?.taxRegisterNumber ?? '-'}`,
          `RIB: ${company?.rib?.toString() ?? '-'}`,
          `Banque: ${company?.bank ?? '-'}`,
          `Agence: ${branch?.name ?? '-'}`,
        ].forEach(t => { doc.text(t, bx + 10, y); y += 7; });
        y += 3;

        doc.fontSize(fsS).font('Helvetica')
          .text('Signature client:', bx + 5, y);
        doc.moveTo(bx + 65, y + 3).lineTo(bx + 180, y + 3).stroke();
        y += 10;
      }

      return y;
    };

    const endY1 = drawSection(15, false, 'COPIE CLIENT');
    const sepY = endY1 + 4;
    doc.moveTo(ml, sepY).lineTo(ml + pageWidth, sepY).stroke('#CCCCCC');
    drawSection(sepY + 4, true, 'COPIE SOCIÉTÉ');

    doc.fontSize(6).fillColor('gray')
      .text(
        `Généré le ${new Date().toLocaleString('fr-FR')}`,
        ml, doc.page.height - 16,
        { align: 'right' },
      );

    doc.end();
    return new Promise((resolve) =>
      doc.on('end', () => resolve(Buffer.concat(buffers))),
    );
  }

  private drawTwoColumnBox(
    doc: typeof PDFDocument,
    x: number,
    y: number,
    width: number,
    title: string,
    items: string[],
  ) {
    const colWidth = width / 2 - 10;
    const lineHeight = 10;
    doc.rect(x, y, width, 70).stroke();
    doc.font('Helvetica-Bold').fontSize(8).text(title, x, y + 5, { width, align: 'center' });
    doc.font('Helvetica').fontSize(7);
    items.forEach((item, i) => {
      const colX = i % 2 === 0 ? x + 5 : x + colWidth + 15;
      const rowY = y + 20 + Math.floor(i / 2) * lineHeight;
      doc.text(`• ${item}`, colX, rowY, { width: colWidth });
    });
  }

  async generateStockReport(
    branchId: number,
    parts: { modelName: string; partName: string; count: number }[],
  ): Promise<string> {
    if (!parts.length) {
      throw new BadRequestException('No stock data provided');
    }
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, `stock-${branchId}.pdf`);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(18).text('Rapport de Stock Critique', { align: 'center' });
    doc.moveDown();
    parts.forEach((p, i) => {
      doc.text(`${i + 1}. ${p.modelName} - ${p.partName} (${p.count} unités)`);
    });
    doc.end();
    return filePath;
  }
}
