import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { Company } from 'src/company/entities/company.entity';
import { OtherCost } from 'src/other-cost/entities/other-cost.entity';
import { PartsPrice } from 'src/parts-price/entities/parts-price.entity';
import { InvoiceService } from './invoice.service';

@Injectable()
export class InvoicePdfService {
  constructor(
    @InjectRepository(Company) private readonly companyRepositry: Repository<Company>,
    @InjectRepository(OtherCost) private readonly otherCostRepositry: Repository<OtherCost>,
    @InjectRepository(PartsPrice) private readonly partsPriceRepositry: Repository<PartsPrice>,
    private readonly invoiceService: InvoiceService,
  ) { }

  async generatePdf(id: number, res: any): Promise<void> {
    const PDFDocument = require('pdfkit');

    const invoice = await this.invoiceService.findOne(id);
    if (!invoice) throw new NotFoundException('Invoice not found');

    const repair = invoice.repair as any;
    const customer = repair?.customer;
    const device = repair?.device;
    const model = device?.model;

    let parts: any[] = [];
    let otherCosts: any[] = [];
    let levelRepairPrice = 0;
    let partsTotal = 0;
    let otherCostsTotal = 0;
    let totalHT = 0;
    let tva = 0;
    let tvaAmount = 0;
    let timbreFiscale = 0;
    let totalTTC = 0;

    const storedDetails: any = (invoice as any).details;

    if (storedDetails) {
      parts = storedDetails.parts ?? [];
      otherCosts = storedDetails.otherCosts ?? [];
      levelRepairPrice = storedDetails.levelRepairPrice ?? 0;
      partsTotal = storedDetails.partsTotal ?? 0;
      otherCostsTotal = storedDetails.otherCostsTotal ?? 0;
      totalHT = storedDetails.totalHT ?? 0;
      tva = storedDetails.tva ?? 0;
      tvaAmount = storedDetails.tvaAmount ?? 0;
      timbreFiscale = storedDetails.timbreFiscale ?? 0;
      totalTTC = storedDetails.totalTTC ?? 0;
    } else {
      const companies = await this.companyRepositry.find({ take: 1 });
      tva = companies[0]?.tva ?? 0;
      timbreFiscale = companies[0]?.timbreFiscale ?? 0;
      const modelId = model?.id;
      const partIds: number[] = repair?.partsNeed ?? [];
      if (modelId && partIds.length > 0) {
        const partsPrices = await this.partsPriceRepositry.find({
          where: { model: { id: modelId }, allPart: { id: In(partIds) } },
          relations: ['allPart', 'levelRepair'],
        });
        parts = partsPrices.map(pp => ({
          partId: pp.allPart?.id ?? 0,
          partName: pp.allPart?.description ?? `Pièce #${pp.allPart?.id}`,
          price: pp.price ?? 0,
        }));
        const levelPrices = partsPrices.map(pp => pp.levelRepair?.price ?? 0).filter(p => p > 0);
        levelRepairPrice = levelPrices.length > 0 ? Math.max(...levelPrices) : 0;
      }
      const otherCostEntities = await this.otherCostRepositry.find({ where: { status: 'Autoriser' } });
      otherCosts = otherCostEntities.map(c => ({ id: c.id, name: c.name, price: c.price }));
      partsTotal = parts.reduce((s: number, p: any) => s + p.price, 0);
      otherCostsTotal = otherCosts.reduce((s: number, c: any) => s + (c.price ?? 0), 0);
      totalHT = partsTotal + levelRepairPrice + otherCostsTotal;
      tvaAmount = totalHT * (tva / 100);
      totalTTC = totalHT + tvaAmount + timbreFiscale;
    }

    const missingPrice = parts.find((p: any) => !p.price || p.price === 0);
    if (missingPrice) {
      throw new BadRequestException(
        `Prix non disponible pour la pièce "${missingPrice.partName}". Veuillez configurer le prix avant de générer le PDF.`
      );
    }
    const repairPartIds: number[] = repair?.partsNeed ?? [];
    if (repairPartIds.length > 0 && parts.length === 0) {
      throw new BadRequestException(
        'Aucun prix configuré pour les pièces de cette réparation. Veuillez configurer les prix avant de générer le PDF.'
      );
    }

    const companyRows = await this.companyRepositry.find({ take: 1 });
    const company = companyRows[0] ?? {};
    const branch = (invoice.user as any)?.branch ?? {};
    const ttcInWords = this.numberToFrench(totalTTC);

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="facture_${invoice.id}.pdf"`);
    doc.pipe(res);

    const primary = '#0D47A1';
    const gray = '#666';

    const pageWidth = doc.page.width - 80;

    if ((company as any).logo) {
      try {
        const logoPath = require('path').join(process.cwd(), 'upload', 'company', (company as any).logo);
        doc.image(logoPath, 40, doc.y, { width: 90 });
      } catch { }
    }
    doc.fontSize(16).font('Helvetica-Bold').fillColor(primary).text(
      (company as any).name ?? 'FACTURE', { align: 'center' }
    );
    doc.moveDown(0.3);
    doc.fontSize(8).font('Helvetica').fillColor(gray);
    doc.text(`Siège: ${(company as any).headquarterslocation ?? ''}`, { align: 'center' });
    doc.text(`Matricule fiscal: ${(company as any).taxRegisterNumber ?? ''}`, { align: 'center' });
    doc.text(`RIB: ${(company as any).rib ?? ''} — ${(company as any).bank ?? ''}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.moveTo(40, doc.y).lineTo(40 + pageWidth, doc.y).strokeColor('#ddd').stroke();
    doc.moveDown(1);

    doc.fontSize(10).font('Helvetica').fillColor(gray);
    doc.text(`N° Facture: ${invoice.id}`, { align: 'right' });
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString('fr-FR')}`, { align: 'right' });
    doc.moveDown(1);

    doc.fontSize(11).font('Helvetica-Bold').fillColor('#333').text('Client');
    doc.fontSize(10).font('Helvetica').fillColor('#333');
    doc.text(`Nom: ${customer?.name || '-'}`);
    doc.text(`Tél: ${customer?.phone || '-'}`);
    doc.moveDown(0.5);

    doc.moveTo(40, doc.y).lineTo(40 + pageWidth, doc.y).strokeColor('#ddd').stroke();
    doc.moveDown(0.5);

    doc.fontSize(11).font('Helvetica-Bold').fillColor('#333').text('Appareil');
    doc.fontSize(10).font('Helvetica').fillColor('#333');
    doc.text(`Marque/Modèle: ${model?.brand?.name || ''} ${model?.name || ''}`);
    doc.text(`N/S: ${device?.serialenumber || '-'}`);
    doc.moveDown(1);

    doc.moveTo(40, doc.y).lineTo(40 + pageWidth, doc.y).strokeColor('#ddd').stroke();
    doc.moveDown(0.5);

    doc.fontSize(11).font('Helvetica-Bold').fillColor('#333').text('Détail des prix');
    doc.moveDown(0.3);

    const tableTop = doc.y;
    const col1 = 40, col2 = 300, col3 = 450, col4 = 520;

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#fff');
    doc.rect(col1, tableTop, pageWidth, 18).fill(primary);
    doc.fillColor('#fff');
    doc.text('Désignation', col1 + 5, tableTop + 4);
    doc.text('Qté', col2, tableTop + 4, { width: 40, align: 'left' });
    doc.text('P.U', col3, tableTop + 4, { width: 60, align: 'left' });
    doc.text('Total', col4, tableTop + 4, { width: 60, align: 'left' });

    let y = tableTop + 22;
    doc.fontSize(9).font('Helvetica').fillColor('#333');

    for (const part of parts) {
      doc.text(part.partName, col1 + 5, y);
      doc.text('1', col2, y, { width: 40, align: 'left' });
      doc.text(`${part.price.toFixed(3)}`, col3, y, { width: 60, align: 'left' });
      doc.text(`${part.price.toFixed(3)}`, col4, y, { width: 60, align: 'left' });
      y += 18;
    }

    if (levelRepairPrice > 0) {
      doc.text('Main d\'œuvre', col1 + 5, y);
      doc.text('1', col2, y, { width: 40, align: 'left' });
      doc.text(`${levelRepairPrice.toFixed(3)}`, col3, y, { width: 60, align: 'left' });
      doc.text(`${levelRepairPrice.toFixed(3)}`, col4, y, { width: 60, align: 'left' });
      y += 18;
    }

    for (const oc of otherCosts) {
      doc.text(oc.name ?? 'Autre frais', col1 + 5, y);
      doc.text('1', col2, y, { width: 40, align: 'left' });
      doc.text(`${(oc.price ?? 0).toFixed(3)}`, col3, y, { width: 60, align: 'left' });
      doc.text(`${(oc.price ?? 0).toFixed(3)}`, col4, y, { width: 60, align: 'left' });
      y += 18;
    }

    doc.moveTo(col1, y).lineTo(col1 + pageWidth, y).strokeColor('#ddd').stroke();
    y += 8;

    doc.fontSize(10).font('Helvetica');
    doc.text('Sous-total HT', 380, y, { width: 100, align: 'left' });
    doc.text(`${totalHT.toFixed(3)}`, col4, y, { width: 60, align: 'left' });
    y += 16;

    doc.text(`TVA (${tva}%)`, 380, y, { width: 100, align: 'left' });
    doc.text(`${tvaAmount.toFixed(3)}`, col4, y, { width: 60, align: 'left' });
    y += 16;

    doc.text('Timbre fiscale', 380, y, { width: 100, align: 'left' });
    doc.text(`${timbreFiscale.toFixed(3)}`, col4, y, { width: 60, align: 'left' });
    y += 16;

    doc.moveTo(380, y).lineTo(550, y).strokeColor(primary).stroke();
    y += 8;

    doc.fontSize(12).font('Helvetica-Bold').fillColor(primary);
    doc.text('Total TTC', 380, y, { width: 100, align: 'left' });
    doc.text(`${totalTTC.toFixed(3)}`, col4, y, { width: 60, align: 'left' });
    y += 24;

    doc.fontSize(9).font('Helvetica-Oblique').fillColor('#333');
    doc.text(`Arrêté la présente facture à la somme de : ${ttcInWords} dinars tunisiens.`, 40, y, { width: pageWidth });
    y += 30;

    const footerY = doc.page.height - 100;
    doc.moveTo(40, footerY).lineTo(40 + pageWidth, footerY).strokeColor('#ddd').stroke();
    doc.moveDown(0.3);

    doc.fontSize(8).font('Helvetica-Bold').fillColor(primary);
    doc.text(`Agence: ${branch.name ?? '-'}`, 40, footerY + 8, { continued: true });
    doc.text(`  |  ${branch.location ?? ''}`, { continued: true });
    doc.text(`  |  Tél: ${branch.phone ?? ''}  |  ${branch.email ?? ''}`, { align: 'right' });

    if ((company as any).logo) {
      try {
        const logoPath = require('path').join(process.cwd(), 'upload', 'company', (company as any).logo);
        doc.image(logoPath, 40, footerY + 22, { width: 60 });
      } catch { }
    }

    doc.end();
  }

  private numberToFrench(n: number): string {
    if (n === 0) return 'Zéro';
    const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
    const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
    const words: string[] = [];
    const intPart = Math.floor(n);
    const decPart = Math.round((n - intPart) * 1000);
    let remaining = intPart;
    if (remaining >= 1000000) {
      const m = Math.floor(remaining / 1000000);
      if (m === 1) words.push('un million');
      else { words.push(this.numberToFrench(m)); words.push('millions'); }
      remaining %= 1000000;
    }
    if (remaining >= 1000) {
      const th = Math.floor(remaining / 1000);
      if (th === 1) words.push('mille');
      else { words.push(this.numberToFrench(th)); words.push('mille'); }
      remaining %= 1000;
    }
    if (remaining >= 100) {
      const h = Math.floor(remaining / 100);
      if (h === 1) words.push('cent');
      else { words.push(units[h]); words.push('cent'); }
      remaining %= 100;
      if (remaining === 0 && h > 1) words[words.length - 1] += 's';
    }
    if (remaining >= 70 && remaining < 80) {
      words.push('soixante');
      if (remaining === 71) { words.push('et-onze'); }
      else if (remaining > 70) { words.push(teens[remaining - 70]); }
      else { words.push('dix'); }
    } else if (remaining >= 90) {
      words.push('quatre-vingt');
      if (remaining === 91) { words.push('onze'); }
      else if (remaining > 90) { words.push(teens[remaining - 90]); }
      else { words.push('dix'); }
    } else if (remaining >= 20) {
      const t = Math.floor(remaining / 10);
      const tMap = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];
      words.push(tMap[t]);
      remaining %= 10;
      if (remaining > 0 && t === 7) {
        words.push(teens[remaining]);
      } else if (remaining > 0) {
        words.push(units[remaining]);
      }
      if (remaining === 0 && t === 8) words[words.length - 1] += 's';
    } else if (remaining >= 10) {
      words.push(teens[remaining - 10]);
    } else if (remaining > 0) {
      words.push(units[remaining]);
    }
    let result = words.join(' ').replace(/cent s$/, 'cents');
    if (decPart > 0) {
      result += ` virgule ${this.numberToFrench(decPart).toLowerCase()}`;
    }
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
}
