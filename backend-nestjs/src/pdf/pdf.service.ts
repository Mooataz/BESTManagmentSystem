import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Repair } from '../repair/entities/repair.entity';
import { Company } from 'src/company/entities/company.entity';
import { Legislation } from 'src/legislation/entities/legislation.entity';
import { Branch } from 'src/branches/entities/branch.entity';

type PDFSectionConfig = {
  showLegislation?: boolean;
  showPreviousRepairs?: boolean;
  showCompanyHeader?: boolean;
  showSignature?: boolean;
};

@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Legislation)
    private readonly legislationRepository: Repository<Legislation>,
    @InjectRepository(Repair)
    private readonly repairRepository: Repository<Repair>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
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
    const fsN = 6.5;
    const fsS = 5.5;
    const gap = 5;

    const tryImage = (filePath: string, x: number, y: number, w: number) => {
      try {
        if (fs.existsSync(filePath)) { doc.image(filePath, x, y, { width: w }); return true; }
      } catch {}
      return false;
    };

    const drawTextLine = (text: string, x: number, y: number, opts?: { bold?: boolean; color?: string; size?: number; w?: number }) => {
      doc.font(opts?.bold ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(opts?.size ?? fsN)
        .fillColor(opts?.color ?? 'black')
        .text(text, x, y, opts?.w ? { width: opts.w } : undefined);
    };

    const drawSharedHeader = (y: number): number => {
      const bx = ml;
      const by = y;
      const bw = pageWidth;
      const colW = (bw - gap * 2) / 3;
      const pad = 4;
      const lh = 6.5;

      const cols: [string, string[]][] = [
        ['Réparation:', [
          `N°: ${repair.id}`,
          `Date: ${safeDateTime(firstHistory?.date)}`,
          `Étape: ${firstHistory?.step ?? '-'}`,
          `Tech: ${firstTrace?.user?.name ?? '-'}`,
          `Agence: ${branch?.name ?? '-'}`,
        ]],
        ['Appareil:', [
          `S/N: ${repair.device?.serialenumber ?? '-'}`,
          `${brand?.name ?? '-'} ${model?.name ?? '-'}`,
          `Type: ${model?.typeModel?.description ?? '-'}`,
          `État: ${repair.deviceStateReceive ?? '-'}`,
        ]],
        ['Client:', [
          `Nom: ${customer?.name ?? '-'}`,
          `Tél: ${customer?.phone?.toString() ?? '-'}`,
          `Dist: ${distributer?.name ?? '-'}`,
        ]],
      ];

      let maxY = by;
      cols.forEach(([title, items], ci) => {
        const cx = bx + pad + ci * (colW + gap);
        doc.font('Helvetica-Bold').fontSize(fsN).fillColor('#135188').text(title, cx, by + pad);
        let iy = by + pad + 8;
        doc.font('Helvetica').fontSize(fsN).fillColor('black');
        items.forEach(t => { doc.text(t, cx + 2, iy); iy += lh; });
        maxY = Math.max(maxY, iy);
      });

      const boxH = maxY - by + pad;
      doc.rect(bx, by, bw, boxH).stroke();
      y = by + boxH + gap;

      const drawInlineField = (label: string, value: string) => {
        doc.font('Helvetica-Bold').fontSize(fsN).fillColor('black').text(`${label}: `, bx + pad, y, { continued: true });
        doc.font('Helvetica').text(value || '-', { width: bw - 20 });
        y += lh + 1;
      };

      drawInlineField('Accessoires', repair.accessory?.length ? repair.accessory.map(a => a.name).join(', ') : 'Aucun');
      drawInlineField('Pannes', repair.listFault?.length ? repair.listFault.map(f => f.name).join(', ') : 'Aucune');
      drawInlineField('Demande client', repair.customerRequest?.length ? repair.customerRequest.map(r => r.name).join(', ') : 'Aucune');

      return y + 2;
    };

    const drawSection = (y0: number, cfg: PDFSectionConfig): number => {
      let y = y0;
      if (cfg.showCompanyHeader) {
        y = drawCompanyHeader(y) + 2;
      }
      y = drawSharedHeader(y);
      const bx = ml;
      const bw = pageWidth;

      if (cfg.showPreviousRepairs && filteredPrevious.length > 0) {
        y += 1;
        drawTextLine('Réparations antérieures:', bx + gap, y, { bold: true, color: '#135188', size: fsN });
        y += 7;
        doc.font('Helvetica').fontSize(fsS).fillColor('black');
        filteredPrevious.slice(0, 5).forEach((prev, i) => {
          const ph = prev.historyRepair?.[0];
          const pt = ph?.tracability?.[0];
          doc.text(`${i + 1}. N°${prev.id} - ${safeDateTime(ph?.date)} - ${ph?.step ?? '-'} (${pt?.user?.name ?? '-'})`, bx + gap + 4, y);
          y += 6.5;
        });
        y += 1;
      }

      if (cfg.showLegislation) {
        y += 1;
        drawTextLine('Législations:', bx + gap, y, { bold: true, color: '#135188', size: fsN });
        y += 7;
        doc.font('Helvetica').fontSize(fsS).fillColor('black');
        const nCol = 2;
        const cw = (bw - gap * 3) / nCol;
        const legRows = Math.ceil(legislations.length / nCol);
        for (let r = 0; r < legRows; r++) {
          let rowH = 8;
          for (let c = 0; c < nCol; c++) {
            const idx = r * nCol + c;
            if (idx >= legislations.length) break;
            const lx = bx + gap + c * (cw + gap);
            doc.text(`☐ ${legislations[idx].name}`, lx, y, { width: cw });
            const h = doc.heightOfString(`☐ ${legislations[idx].name}`, { width: cw });
            if (h > rowH) rowH = h;
          }
          y += rowH;
        }
        y += gap;

        drawTextLine('Agence:', bx + gap, y, { bold: true, color: '#135188', size: fsN });
        y += 7;
        doc.font('Helvetica').fontSize(fsS).fillColor('black');
        doc.text(`Agence: ${branch?.name ?? '-'}`, bx + gap + 4, y); y += 6.5;
        doc.text(`Tél: ${branch?.phone?.toString() ?? '-'}`, bx + gap + 4, y); y += 6.5;
        y += gap;
      }

      if (cfg.showSignature) {
        doc.font('Helvetica').fontSize(fsS).text('Signature client:', bx + gap, y);
        doc.moveTo(bx + 60, y + 2).lineTo(bx + 150, y + 2).stroke();
        y += 9;
      }

      return y;
    };

    const drawCompanyHeader = (y: number): number => {
      const bx = ml;
      const bw = pageWidth;
      const pad = 5;
      const lh = 7;
      const logoSize = 64;
      const logoPad = 4;

      const hasLogo = company?.logo && fs.existsSync(path.join(__dirname, '..', '..', 'upload', 'company', company.logo));
      const hasBrandLogo = brand?.logo && fs.existsSync(path.join(__dirname, '..', '..', 'upload', 'brands', brand.logo));

      const logoAreaH = hasLogo || hasBrandLogo ? pad + logoPad + logoSize + pad : 0;
      const fieldAreaH = 22;
      const headerH = logoAreaH + fieldAreaH + pad;

      doc.rect(bx, y, bw, headerH).stroke('#135188');

      const logoY = y + pad + logoPad;
      if (hasLogo) {
        tryImage(path.join(__dirname, '..', '..', 'upload', 'company', company.logo!), bx + pad + 2, logoY, logoSize);
      }
      if (hasBrandLogo) {
        tryImage(path.join(__dirname, '..', '..', 'upload', 'brands', brand.logo!), bx + bw - logoSize - pad - 2, logoY, logoSize);
      }

      const titleX = bx + (hasLogo ? logoSize + pad * 2 + 6 : pad);
      const titleW = bw - (hasLogo ? logoSize + pad * 2 + 6 : pad) - (hasBrandLogo ? logoSize + pad * 2 + 6 : pad);
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#135188')
        .text(company?.name ?? 'Société', titleX, logoY + 6, { width: titleW, align: 'center' });

      const fieldY = y + logoAreaH + pad;
      doc.font('Helvetica').fontSize(6.5).fillColor('black');
      const fields: [string, string | undefined][] = [
        ['Adresse', company?.headquarterslocation],
        ['N° fiscal', company?.taxRegisterNumber],
        ['RIB', company?.rib?.toString()],
        ['Banque', company?.bank],
        ['Agence', branch?.name],
      ];
      const fieldColW = (bw - pad * 4) / 3;
      fields.forEach(([label, value], i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const cx = bx + pad + 4 + col * (fieldColW + 4);
        const ry = fieldY + row * (lh + 1);
        doc.font('Helvetica-Bold').text(`${label}: `, cx, ry, { continued: true });
        doc.font('Helvetica').text(value ?? '-');
      });

      return y + headerH + 2;
    };

    let cy = 12;
    cy = drawSection(cy, { showLegislation: true, showCompanyHeader: true, showSignature: true });
    const sepY = cy + 2;
    doc.moveTo(ml, sepY).lineTo(ml + pageWidth, sepY).stroke('#CCCCCC');
    cy = drawSection(sepY + 4, { showPreviousRepairs: true, showCompanyHeader: true, showSignature: true });

    const pRange = doc.bufferedPageRange();
    const wasOnLastPage = pRange.count - 1;
    if (pRange.count > 1) doc.switchToPage(0);
    doc.fontSize(5.5).fillColor('gray')
      .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, ml, doc.page.height - 24, { align: 'right' });
    if (pRange.count > 1) doc.switchToPage(wasOnLastPage);

    doc.end();
    return new Promise((resolve) =>
      doc.on('end', () => resolve(Buffer.concat(buffers))),
    );
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

  async generateStockAlertPdf(
    alertId: number,
    branchId: number,
    report: { brand: string; model: string; part: string; quantity: number }[],
  ): Promise<Buffer> {
    const branch = await this.branchRepository.findOne({
      where: { id: branchId },
      relations: ['company'],
    });
    const company = branch?.company?.id
      ? await this.companyRepository.findOne({ where: { id: branch.company.id } })
      : null;

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const buffers: Buffer[] = [];
    doc.on('data', (b) => buffers.push(b));

    const pageWidth = doc.page.width - 60;
    let y = 30;

    // Company logo
    if (company?.logo) {
      const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
      try {
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, 30, y, { width: 60 });
        }
      } catch {}
    }

    // Title
    doc.font('Helvetica-Bold').fontSize(16).fillColor('#135188')
      .text('Rapport d\'Alerte Stock', 30, y + 10, { align: 'center', width: pageWidth });
    y += 30;

    // Info line
    doc.font('Helvetica').fontSize(9).fillColor('black');
    doc.text(`Agence: ${branch?.name ?? '-'}`, 30, y);
    y += 12;
    doc.text(`Date: ${new Date().toLocaleString('fr-FR')}`, 30, y);
    y += 20;

    // Table header
    const colX = [30, 150, 300, 450];
    const colW = [110, 140, 140, 80];
    const headers = ['Marque', 'Modèle', 'Pièce', 'Quantité'];
    const rowH = 16;

    doc.rect(30, y, pageWidth, rowH).fill('#135188');
    doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
    headers.forEach((h, i) => {
      doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 });
    });
    y += rowH;

    // Table rows
    doc.font('Helvetica').fontSize(8).fillColor('black');
    report.forEach((item, i) => {
      if (y + rowH > doc.page.height - 40) {
        doc.addPage();
        y = 30;
        doc.rect(30, y, pageWidth, rowH).fill('#135188');
        doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
        headers.forEach((h, i) => {
          doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 });
        });
        y += rowH;
        doc.font('Helvetica').fontSize(8).fillColor('black');
      }

      const bgColor = i % 2 === 0 ? '#F5F5F5' : 'white';
      doc.rect(30, y, pageWidth, rowH).fill(bgColor);
      doc.fillColor('black');
      doc.text(item.brand, colX[0] + 4, y + 4, { width: colW[0] - 8 });
      doc.text(item.model, colX[1] + 4, y + 4, { width: colW[1] - 8 });
      doc.text(item.part, colX[2] + 4, y + 4, { width: colW[2] - 8 });
      doc.text(String(item.quantity), colX[3] + 4, y + 4, { width: colW[3] - 8 });
      y += rowH;
    });

    // Summary
    y += 10;
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#135188')
      .text(`Total: ${report.length} pièce(s) sous le seuil d'alerte`, 30, y);

    // Footer
    doc.font('Helvetica').fontSize(7).fillColor('gray')
      .text(
        `Généré le ${new Date().toLocaleString('fr-FR')}`,
        30, doc.page.height - 20,
        { align: 'right' },
      );

    doc.end();
    return new Promise((resolve) =>
      doc.on('end', () => resolve(Buffer.concat(buffers))),
    );
  }

  async generateReceptionAlertPdf(
    alertId: number,
    branchId: number,
    report: { repairId: number; customerName: string; deviceModel: string; serialNumber: string; creationDate: Date }[],
  ): Promise<Buffer> {
    const branch = await this.branchRepository.findOne({
      where: { id: branchId },
      relations: ['company'],
    });
    const company = branch?.company?.id
      ? await this.companyRepository.findOne({ where: { id: branch.company.id } })
      : null;

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const buffers: Buffer[] = [];
    doc.on('data', (b) => buffers.push(b));

    const pageWidth = doc.page.width - 60;
    let y = 30;

    if (company?.logo) {
      const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
      try { if (fs.existsSync(logoPath)) doc.image(logoPath, 30, y, { width: 60 }); } catch {}
    }

    doc.font('Helvetica-Bold').fontSize(16).fillColor('#135188')
      .text('Rapport d\'Alerte Réception', 30, y + 10, { align: 'center', width: pageWidth });
    y += 30;

    doc.font('Helvetica').fontSize(9).fillColor('black');
    doc.text(`Agence: ${branch?.name ?? '-'}`, 30, y);
    y += 12;
    doc.text(`Date: ${new Date().toLocaleString('fr-FR')}`, 30, y);
    y += 12;
    doc.text(`Réparations en Création: ${report.length}`, 30, y);
    y += 20;

    const colX = [30, 130, 260, 380];
    const colW = [90, 120, 120, 120];
    const headers = ['N° Réparation', 'Client', 'Modèle', 'N° Série'];
    const rowH = 16;

    doc.rect(30, y, pageWidth, rowH).fill('#135188');
    doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
    headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
    y += rowH;

    doc.font('Helvetica').fontSize(8).fillColor('black');
    report.forEach((item, i) => {
      if (y + rowH > doc.page.height - 40) {
        doc.addPage(); y = 30;
        doc.rect(30, y, pageWidth, rowH).fill('#135188');
        doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
        headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
        y += rowH;
        doc.font('Helvetica').fontSize(8).fillColor('black');
      }
      const bgColor = i % 2 === 0 ? '#F5F5F5' : 'white';
      doc.rect(30, y, pageWidth, rowH).fill(bgColor);
      doc.fillColor('black');
      doc.text(String(item.repairId), colX[0] + 4, y + 4, { width: colW[0] - 8 });
      doc.text(item.customerName, colX[1] + 4, y + 4, { width: colW[1] - 8 });
      doc.text(item.deviceModel, colX[2] + 4, y + 4, { width: colW[2] - 8 });
      doc.text(item.serialNumber, colX[3] + 4, y + 4, { width: colW[3] - 8 });
      y += rowH;
    });

    y += 10;
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#135188')
      .text(`Total: ${report.length} réparation(s) bloquée(s) en Création`, 30, y);

    doc.font('Helvetica').fontSize(7).fillColor('gray')
      .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 30, doc.page.height - 20, { align: 'right' });

    doc.end();
    return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(buffers))));
  }

  async generateAffectationAlertPdf(
    alertId: number,
    branchId: number,
    report: { repairId: number; customerName: string; deviceModel: string; serialNumber: string; creationDate: Date }[],
  ): Promise<Buffer> {
    const branch = await this.branchRepository.findOne({
      where: { id: branchId },
      relations: ['company'],
    });
    const company = branch?.company?.id
      ? await this.companyRepository.findOne({ where: { id: branch.company.id } })
      : null;

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const buffers: Buffer[] = [];
    doc.on('data', (b) => buffers.push(b));

    const pageWidth = doc.page.width - 60;
    let y = 30;

    if (company?.logo) {
      const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
      try { if (fs.existsSync(logoPath)) doc.image(logoPath, 30, y, { width: 60 }); } catch {}
    }

    doc.font('Helvetica-Bold').fontSize(16).fillColor('#135188')
      .text('Rapport d\'Alerte Affectation', 30, y + 10, { align: 'center', width: pageWidth });
    y += 30;

    doc.font('Helvetica').fontSize(9).fillColor('black');
    doc.text(`Agence: ${branch?.name ?? '-'}`, 30, y);
    y += 12;
    doc.text(`Date: ${new Date().toLocaleString('fr-FR')}`, 30, y);
    y += 12;
    doc.text(`Réparations en Affectation: ${report.length}`, 30, y);
    y += 20;

    const colX = [30, 130, 260, 380];
    const colW = [90, 120, 120, 120];
    const headers = ['N° Réparation', 'Client', 'Modèle', 'N° Série'];
    const rowH = 16;

    doc.rect(30, y, pageWidth, rowH).fill('#135188');
    doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
    headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
    y += rowH;

    doc.font('Helvetica').fontSize(8).fillColor('black');
    report.forEach((item, i) => {
      if (y + rowH > doc.page.height - 40) {
        doc.addPage(); y = 30;
        doc.rect(30, y, pageWidth, rowH).fill('#135188');
        doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
        headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
        y += rowH;
        doc.font('Helvetica').fontSize(8).fillColor('black');
      }
      const bgColor = i % 2 === 0 ? '#F5F5F5' : 'white';
      doc.rect(30, y, pageWidth, rowH).fill(bgColor);
      doc.fillColor('black');
      doc.text(String(item.repairId), colX[0] + 4, y + 4, { width: colW[0] - 8 });
      doc.text(item.customerName, colX[1] + 4, y + 4, { width: colW[1] - 8 });
      doc.text(item.deviceModel, colX[2] + 4, y + 4, { width: colW[2] - 8 });
      doc.text(item.serialNumber, colX[3] + 4, y + 4, { width: colW[3] - 8 });
      y += rowH;
    });

    y += 10;
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#135188')
      .text(`Total: ${report.length} réparation(s) bloquée(s) en Affectation`, 30, y);

    doc.font('Helvetica').fontSize(7).fillColor('gray')
      .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 30, doc.page.height - 20, { align: 'right' });

    doc.end();
    return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(buffers))));
  }

  async generateReparationAlertPdf(
    alertId: number,
    branchId: number,
    report: { repairId: number; customerName: string; deviceModel: string; serialNumber: string; creationDate: Date }[],
  ): Promise<Buffer> {
    const branch = await this.branchRepository.findOne({
      where: { id: branchId },
      relations: ['company'],
    });
    const company = branch?.company?.id
      ? await this.companyRepository.findOne({ where: { id: branch.company.id } })
      : null;

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const buffers: Buffer[] = [];
    doc.on('data', (b) => buffers.push(b));

    const pageWidth = doc.page.width - 60;
    let y = 30;

    if (company?.logo) {
      const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
      try { if (fs.existsSync(logoPath)) doc.image(logoPath, 30, y, { width: 60 }); } catch {}
    }

    doc.font('Helvetica-Bold').fontSize(16).fillColor('#135188')
      .text('Rapport d\'Alerte Réparation', 30, y + 10, { align: 'center', width: pageWidth });
    y += 30;

    doc.font('Helvetica').fontSize(9).fillColor('black');
    doc.text(`Agence: ${branch?.name ?? '-'}`, 30, y);
    y += 12;
    doc.text(`Date: ${new Date().toLocaleString('fr-FR')}`, 30, y);
    y += 12;
    doc.text(`Réparations en cours: ${report.length}`, 30, y);
    y += 20;

    const colX = [30, 130, 260, 380];
    const colW = [90, 120, 120, 120];
    const headers = ['N° Réparation', 'Client', 'Modèle', 'N° Série'];
    const rowH = 16;

    doc.rect(30, y, pageWidth, rowH).fill('#135188');
    doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
    headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
    y += rowH;

    doc.font('Helvetica').fontSize(8).fillColor('black');
    report.forEach((item, i) => {
      if (y + rowH > doc.page.height - 40) {
        doc.addPage(); y = 30;
        doc.rect(30, y, pageWidth, rowH).fill('#135188');
        doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
        headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
        y += rowH;
        doc.font('Helvetica').fontSize(8).fillColor('black');
      }
      const bgColor = i % 2 === 0 ? '#F5F5F5' : 'white';
      doc.rect(30, y, pageWidth, rowH).fill(bgColor);
      doc.fillColor('black');
      doc.text(String(item.repairId), colX[0] + 4, y + 4, { width: colW[0] - 8 });
      doc.text(item.customerName, colX[1] + 4, y + 4, { width: colW[1] - 8 });
      doc.text(item.deviceModel, colX[2] + 4, y + 4, { width: colW[2] - 8 });
      doc.text(item.serialNumber, colX[3] + 4, y + 4, { width: colW[3] - 8 });
      y += rowH;
    });

    y += 10;
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#135188')
      .text(`Total: ${report.length} réparation(s) en attente`, 30, y);

    doc.font('Helvetica').fontSize(7).fillColor('gray')
      .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 30, doc.page.height - 20, { align: 'right' });

    doc.end();
    return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(buffers))));
  }

  async generateCqAlertPdf(
    alertId: number,
    branchId: number,
    report: { repairId: number; customerName: string; deviceModel: string; serialNumber: string; creationDate: Date }[],
  ): Promise<Buffer> {
    const branch = await this.branchRepository.findOne({
      where: { id: branchId },
      relations: ['company'],
    });
    const company = branch?.company?.id
      ? await this.companyRepository.findOne({ where: { id: branch.company.id } })
      : null;

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const buffers: Buffer[] = [];
    doc.on('data', (b) => buffers.push(b));

    const pageWidth = doc.page.width - 60;
    let y = 30;

    if (company?.logo) {
      const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
      try { if (fs.existsSync(logoPath)) doc.image(logoPath, 30, y, { width: 60 }); } catch {}
    }

    doc.font('Helvetica-Bold').fontSize(16).fillColor('#135188')
      .text('Rapport d\'Alerte CQ', 30, y + 10, { align: 'center', width: pageWidth });
    y += 30;

    doc.font('Helvetica').fontSize(9).fillColor('black');
    doc.text(`Agence: ${branch?.name ?? '-'}`, 30, y);
    y += 12;
    doc.text(`Date: ${new Date().toLocaleString('fr-FR')}`, 30, y);
    y += 12;
    doc.text(`Réparations en CQ: ${report.length}`, 30, y);
    y += 20;

    const colX = [30, 130, 260, 380];
    const colW = [90, 120, 120, 120];
    const headers = ['N° Réparation', 'Client', 'Modèle', 'N° Série'];
    const rowH = 16;

    doc.rect(30, y, pageWidth, rowH).fill('#135188');
    doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
    headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
    y += rowH;

    doc.font('Helvetica').fontSize(8).fillColor('black');
    report.forEach((item, i) => {
      if (y + rowH > doc.page.height - 40) {
        doc.addPage(); y = 30;
        doc.rect(30, y, pageWidth, rowH).fill('#135188');
        doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
        headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
        y += rowH;
        doc.font('Helvetica').fontSize(8).fillColor('black');
      }
      const bgColor = i % 2 === 0 ? '#F5F5F5' : 'white';
      doc.rect(30, y, pageWidth, rowH).fill(bgColor);
      doc.fillColor('black');
      doc.text(String(item.repairId), colX[0] + 4, y + 4, { width: colW[0] - 8 });
      doc.text(item.customerName, colX[1] + 4, y + 4, { width: colW[1] - 8 });
      doc.text(item.deviceModel, colX[2] + 4, y + 4, { width: colW[2] - 8 });
      doc.text(item.serialNumber, colX[3] + 4, y + 4, { width: colW[3] - 8 });
      y += rowH;
    });

    y += 10;
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#135188')
      .text(`Total: ${report.length} réparation(s) bloquée(s) en CQ`, 30, y);

    doc.font('Helvetica').fontSize(7).fillColor('gray')
      .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 30, doc.page.height - 20, { align: 'right' });

    doc.end();
    return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(buffers))));
  }

  async generateStockPartTicketPdf(
    stockParts: any[],
  ): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 15, size: 'A4' });
    const buffers: Buffer[] = [];
    doc.on('data', (b) => buffers.push(b));

    const pageWidth = doc.page.width - 30;
    const cols = 3;
    const gap = 6;
    const colW = (pageWidth - gap * (cols - 1)) / cols;
    const labelW = 58;
    const valXOff = labelW + 2;
    const lineH = 9;
    const headerH = 14;
    const padd = 4;
    const ticketH = headerH + 11 * lineH + padd * 2;

    const colX: number[] = [];
    for (let i = 0; i < cols; i++) {
      colX.push(15 + i * (colW + gap));
    }

    const ticketsPerPage = 12;
    const rowsPerPage = Math.floor(ticketsPerPage / cols);

    for (let idx = 0; idx < stockParts.length; idx++) {
      const sp = stockParts[idx];
      const pageIdx = Math.floor(idx / ticketsPerPage);
      const posInPage = idx % ticketsPerPage;
      const col = posInPage % cols;
      const row = Math.floor(posInPage / cols);

      if (posInPage === 0 && pageIdx > 0) {
        doc.addPage();
      }

      const x = colX[col];
      const y = 15 + row * (ticketH + gap);

      const branch = sp.bin?.branch;

      const fieldRows: [string, string][] = [
        ['ID:', String(sp.id)],
        ['N° Série:', sp.serialNumber ?? '-'],
        ['Casier:', sp.bin?.name ?? '-'],
        ['Type Casier:', sp.bin?.type ?? '-'],
        ['Agence:', branch?.name ?? '-'],
        ['Code Matière:', sp.reference?.materialCode ?? '-'],
        ['Description:', sp.reference?.description ?? '-'],
        ['Marque:', sp.reference?.model?.[0]?.brand?.name ?? '-'],
        ['Type Modèle:', sp.reference?.model?.[0]?.typeModel?.description ?? '-'],
        ['Modèle:', sp.reference?.model?.[0]?.name ?? '-'],
        ['Pièce:', sp.reference?.allpart?.description ?? '-'],
      ];

      doc.rect(x, y, colW, ticketH).stroke('#333');

      doc.font('Helvetica-Bold').fontSize(6).fillColor('#135188');
      fieldRows.forEach(([label], i) => {
        doc.text(label, x + padd, y + headerH + i * lineH, { width: labelW });
      });

      doc.font('Helvetica').fontSize(6).fillColor('black');
      fieldRows.forEach(([, value], i) => {
        doc.text(value, x + padd + valXOff, y + headerH + i * lineH, {
          width: colW - valXOff - padd * 2,
        });
      });
    }

    doc.font('Helvetica').fontSize(6).fillColor('gray')
      .text(
        `Imprimé le ${new Date().toLocaleString('fr-FR')}`,
        15, doc.page.height - 20,
        { align: 'right' },
      );

    doc.end();
    return new Promise((resolve) =>
      doc.on('end', () => resolve(Buffer.concat(buffers))),
    );
  }

  async generateBloqueAlertPdf(
    alertId: number,
    branchId: number,
    report: { step: string; count: number }[],
  ): Promise<Buffer> {
    const branch = await this.branchRepository.findOne({
      where: { id: branchId },
      relations: ['company'],
    });
    const company = branch?.company?.id
      ? await this.companyRepository.findOne({ where: { id: branch.company.id } })
      : null;

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const buffers: Buffer[] = [];
    doc.on('data', (b) => buffers.push(b));

    const pageWidth = doc.page.width - 60;
    let y = 30;

    if (company?.logo) {
      const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
      try { if (fs.existsSync(logoPath)) doc.image(logoPath, 30, y, { width: 60 }); } catch {}
    }

    doc.font('Helvetica-Bold').fontSize(16).fillColor('#135188')
      .text('Rapport d\'Alerte Blocage', 30, y + 10, { align: 'center', width: pageWidth });
    y += 30;

    doc.font('Helvetica').fontSize(9).fillColor('black');
    doc.text(`Agence: ${branch?.name ?? '-'}`, 30, y);
    y += 12;
    doc.text(`Date: ${new Date().toLocaleString('fr-FR')}`, 30, y);
    y += 20;

    const colX = [30, 300];
    const colW = [260, 200];
    const headers = ['Étape bloquée', 'Nombre de réparations'];
    const rowH = 16;

    doc.rect(30, y, pageWidth, rowH).fill('#135188');
    doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
    headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
    y += rowH;

    doc.font('Helvetica').fontSize(8).fillColor('black');
    report.forEach((item, i) => {
      const bgColor = i % 2 === 0 ? '#F5F5F5' : 'white';
      doc.rect(30, y, pageWidth, rowH).fill(bgColor);
      doc.fillColor('black');
      doc.text(item.step, colX[0] + 4, y + 4, { width: colW[0] - 8 });
      doc.text(String(item.count), colX[1] + 4, y + 4, { width: colW[1] - 8 });
      y += rowH;
    });

    y += 10;
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#135188')
      .text(`Total: ${report.length} étape(s) bloquée(s) (> 50 réparations)`, 30, y);

    doc.font('Helvetica').fontSize(7).fillColor('gray')
      .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 30, doc.page.height - 20, { align: 'right' });

    doc.end();
    return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(buffers))));
  }
}
