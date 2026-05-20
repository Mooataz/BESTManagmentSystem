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
import { Model } from 'src/models/entities/model.entity';

@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Legislation)
    private readonly legislationRepository: Repository<Legislation>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
  ) {}

  // =====================================================
  // ✅ GÉNÉRATION FICHE DE RÉPARATION PDF
  // =====================================================
  async generatRepairPdf(repair: Repair): Promise<Buffer> {
    if (!repair?.device?.model) {
      throw new BadRequestException('Repair device or model missing');
    }

    const doc = new PDFDocument({ margin: 20 });
    const buffers: Buffer[] = [];

    doc.on('data', (b) => buffers.push(b));

    // =====================================================
    // Données sécurisées
    // =====================================================
    const firstHistory = repair.historyRepair?.[0];
    const firstTrace = firstHistory?.tracability?.[0];
    const branch = firstTrace?.user?.branch;

    const company = branch?.company?.id
      ? await this.companyRepository.findOne({
          where: { id: branch.company.id },
        })
      : null;

    const model = await this.modelRepository.findOne({
      where: { id: repair.device.model.id },
      relations: ['brand', 'typeModel'],
    });

    const legislations = await this.legislationRepository.find();

    const safeDate = (d?: Date) =>
      d ? new Date(d).toLocaleDateString('fr-FR') : 'N/A';

    // =====================================================
    // HEADER
    // =====================================================
    const startX = 40;
    const startY = 20;
    const logoWidth = 80;

    if (company?.logo) {
      const logoPath = path.join(
        __dirname,
        '..',
        '..',
        'upload',
        'company',
        company.logo,
      );
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, startX, startY, { width: logoWidth });
        doc
          .fontSize(10)
          .fillColor('#135188')
          .text(company.name as string, startX + logoWidth + 10, startY + 15);
      }
    }

    doc
      .fillColor('black')
      .fontSize(12)
      .text(`Fiche de Réparation N° ${repair.id}`, 0, startY + 60, {
        align: 'center',
      });

    // =====================================================
    // BOÎTES D’INFOS
    // =====================================================
    const boxY = startY + 90;
    const boxWidth = (doc.page.width - 80) / 3;

    const box1 = [
      { label: 'Client', value: repair.customer?.name ?? '-' },
      { label: 'Téléphone', value: repair.customer?.phone ?? '-' },
      { label: 'Agence', value: branch?.name ?? '-' },
      { label: 'Reçu le', value: safeDate(firstHistory?.date) },
    ];

    const box2 = [
      { label: 'Appareil', value: repair.device.serialenumber ?? '-' },
      { label: 'Marque', value: model?.brand?.name ?? '-' },
      { label: 'Modèle', value: model?.name ?? '-' },
      { label: 'Type', value: model?.typeModel?.description ?? '-' },
    ];

    const box3 = [
      { label: 'État reçu', value: repair.deviceStateReceive ?? '-' },
      {
        label: 'Accessoires',
        value:
          repair.accessory?.length > 0
            ? repair.accessory.map((a) => a.name)
            : ['Aucun'],
      },
    ];

    const drawBox = (
      x: number,
      y: number,
      width: number,
      items: { label: string; value: string | string[] }[],
    ) => {
      doc.rect(x, y, width, 90).stroke();

      let currentY = y + 8;
      items.forEach((i) => {
        doc.fontSize(8).font('Helvetica-Bold').text(`${i.label}:`, x + 5, currentY);
        doc
          .font('Helvetica')
          .text(
            Array.isArray(i.value) ? i.value.join(', ') : i.value,
            x + 70,
            currentY,
          );
        currentY += 14;
      });
    };

    drawBox(20, boxY, boxWidth, box1 as { label: string; value: string }[]);
    drawBox(20 + boxWidth + 20, boxY, boxWidth, box2 as { label: string; value: string }[]);
    drawBox(20 + (boxWidth + 20) * 2, boxY, boxWidth, box3  as { label: string; value: string }[] );

    // =====================================================
    // LÉGISLATIONS
    // =====================================================
    this.drawTwoColumnBox(
      doc,
      20,
      boxY + 110,
      doc.page.width - 40,
      'Législations applicables',
      legislations.map((l) => l.name),
    );

    // =====================================================
    // PIED DE PAGE
    // =====================================================
    doc
      .fontSize(6)
      .fillColor('gray')
      .text(
        `Document généré le ${new Date().toLocaleDateString('fr-FR')}`,
        20,
        doc.page.height - 30,
        { align: 'right' },
      );

    doc.end();

    return new Promise((resolve) =>
      doc.on('end', () => resolve(Buffer.concat(buffers))),
    );
  }

  // =====================================================
  // ✅ BOÎTE 2 COLONNES
  // =====================================================
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
    doc.font('Helvetica-Bold').fontSize(8).text(title, x, y + 5, {
      width,
      align: 'center',
    });

    doc.font('Helvetica').fontSize(7);
    items.forEach((item, i) => {
      const colX = i % 2 === 0 ? x + 5 : x + colWidth + 15;
      const rowY = y + 20 + Math.floor(i / 2) * lineHeight;
      doc.text(`• ${item}`, colX, rowY, { width: colWidth });
    });
  }

  // =====================================================
  // ✅ RAPPORT DE STOCK
  // =====================================================
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
      doc.text(
        `${i + 1}. ${p.modelName} - ${p.partName} (${p.count} unités)`,
      );
    });

    doc.end();
    return filePath;
  }
}