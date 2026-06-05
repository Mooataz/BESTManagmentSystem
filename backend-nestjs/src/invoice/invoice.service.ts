import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repair } from 'src/repair/entities/repair.entity';
import { User } from 'src/users/entities/user.entity';
import { OtherCost } from 'src/other-cost/entities/other-cost.entity';
import { PartsPrice } from 'src/parts-price/entities/parts-price.entity';
import { LevelRepair } from 'src/level-repair/entities/level-repair.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class InvoiceService {

  constructor(
    @InjectRepository(Invoice) private readonly invoiceRepositry: Repository<Invoice>,
    @InjectRepository(Repair) private readonly repairRepositry: Repository<Repair>,
    @InjectRepository(User) private readonly userRepositry: Repository<User>,
    @InjectRepository(OtherCost) private readonly otherCostRepositry: Repository<OtherCost>,
    @InjectRepository(PartsPrice) private readonly partsPriceRepositry: Repository<PartsPrice>,
    @InjectRepository(LevelRepair) private readonly levelRepairRepositry: Repository<LevelRepair>,
    @InjectRepository(AllPart) private readonly allPartRepositry: Repository<AllPart>,
    @InjectRepository(Company) private readonly companyRepositry: Repository<Company>,
  ) { }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const otherCostEntities = createInvoiceDto.otherCost?.length
      ? await this.otherCostRepositry.find({
          where: { id: In(createInvoiceDto.otherCost) },
        })
      : [];

    const repair = await this.repairRepositry.findOne({
      where: { id: createInvoiceDto.repair },
      relations: ['device', 'device.model', 'repairAction'],
    });
    if (!repair) {
      throw new NotFoundException(`repair with ID ${createInvoiceDto.repair} not found`);
    }

    const user = await this.userRepositry.findOne({
      where: { id: createInvoiceDto.user },
    });
    if (!user) {
      throw new NotFoundException(`user with ID ${createInvoiceDto.user} not found`);
    }

    const companies = await this.companyRepositry.find({ take: 1 });
    const tva = companies[0]?.tva ?? 0;
    const timbreFiscale = companies[0]?.timbreFiscale ?? 0;

    const modelId = (repair as any).device?.model?.id;
    const partIds: number[] = (repair as any).partsNeed ?? [];
    let parts: any[] = [];
    let levelRepairPrice = 0;

    if (modelId && partIds.length > 0) {
      const partsPrices = await this.partsPriceRepositry.find({
        where: { model: { id: modelId }, allPart: { id: In(partIds) } },
        relations: ['allPart', 'levelRepair'],
      });
      parts = partsPrices.map(pp => ({
        partId: pp.allPart?.id ?? 0,
        partName: pp.allPart?.description ?? `Pièce #${pp.allPart?.id}`,
        price: pp.price ?? 0,
        levelRepairName: pp.levelRepair?.name ?? null,
        levelRepairPrice: pp.levelRepair?.price ?? 0,
      }));
      const levelPrices = partsPrices
        .map(pp => pp.levelRepair?.price ?? 0)
        .filter(p => p > 0);
      levelRepairPrice = levelPrices.length > 0 ? Math.max(...levelPrices) : 0;
    }

    const partsTotal = parts.reduce((s: number, p: any) => s + p.price, 0);
    const otherCostsTotal = otherCostEntities.reduce((s, c) => s + (c.price ?? 0), 0);
    const totalHT = partsTotal + levelRepairPrice + otherCostsTotal;
    const tvaAmount = totalHT * (tva / 100);
    const totalTTC = totalHT + tvaAmount + timbreFiscale;

    const details = {
      parts,
      levelRepairPrice,
      partsTotal,
      otherCosts: otherCostEntities.map(c => ({ id: c.id, name: c.name, price: c.price })),
      otherCostsTotal,
      totalHT,
      tva,
      tvaAmount,
      timbreFiscale,
      totalTTC,
    };

    const newCreate = this.invoiceRepositry.create({
      ...createInvoiceDto,
      tva,
      timbreFiscale,
      partsTotal,
      levelRepairPrice,
      otherCostsTotal,
      totalPrice: totalTTC,
      details,
      otherCost: otherCostEntities.length ? otherCostEntities : undefined,
      repair,
      user,
    });

    return await this.invoiceRepositry.save(newCreate);
  }

  async findAll(): Promise<Invoice[]> {
    const allfind = await this.invoiceRepositry.find({ relations: ['repair', 'user', 'otherCost'] });
    if (!allfind || allfind.length === 0) {
      throw new NotFoundException("There is no data available");
    }
    return allfind;
  }

  async findOne(id: number): Promise<Invoice> {
    const onefind = await this.invoiceRepositry.findOne({
      where: { id },
      relations: [
        'repair', 'repair.device', 'repair.device.model', 'repair.device.model.brand',
        'repair.customer', 'repair.user', 'user', 'user.branch', 'otherCost',
      ],
    });
    if (!onefind) {
      throw new NotFoundException("There is no data Available");
    }
    return onefind;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.invoiceRepositry.findOne({
      where: { id },
      relations: ['repair', 'repair.device', 'repair.device.model', 'otherCost'],
    });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    const { otherCost, repair, user, ...rest } = updateInvoiceDto;

    Object.assign(invoice, rest);

    let otherCostEntities = invoice.otherCost ?? [];

    if (otherCost !== undefined) {
      otherCostEntities = otherCost.length
        ? await this.otherCostRepositry.find({ where: { id: In(otherCost) } })
        : [];
      invoice.otherCost = otherCostEntities;
    }

    if (repair !== undefined) {
      const repairEntity = await this.repairRepositry.findOne({ where: { id: repair } });
      if (!repairEntity) { throw new NotFoundException('No repair found'); }
      invoice.repair = repairEntity;
    }

    if (user !== undefined) {
      const userEntity = await this.userRepositry.findOne({ where: { id: user } });
      if (!userEntity) { throw new NotFoundException('No user found'); }
      invoice.user = userEntity;
    }

    const companies = await this.companyRepositry.find({ take: 1 });
    const tva = companies[0]?.tva ?? 0;
    const timbreFiscale = companies[0]?.timbreFiscale ?? 0;

    const repairData = (repair !== undefined ? invoice.repair : (invoice as any).repair) as any;
    const modelId = repairData?.device?.model?.id;
    const partIds: number[] = repairData?.partsNeed ?? [];
    let parts: any[] = [];
    let levelRepairPrice = 0;

    if (modelId && partIds.length > 0) {
      const partsPrices = await this.partsPriceRepositry.find({
        where: { model: { id: modelId }, allPart: { id: In(partIds) } },
        relations: ['allPart', 'levelRepair'],
      });
      parts = partsPrices.map(pp => ({
        partId: pp.allPart?.id ?? 0,
        partName: pp.allPart?.description ?? `Pièce #${pp.allPart?.id}`,
        price: pp.price ?? 0,
        levelRepairName: pp.levelRepair?.name ?? null,
        levelRepairPrice: pp.levelRepair?.price ?? 0,
      }));
      const levelPrices = partsPrices
        .map(pp => pp.levelRepair?.price ?? 0)
        .filter(p => p > 0);
      levelRepairPrice = levelPrices.length > 0 ? Math.max(...levelPrices) : 0;
    }

    const partsTotal = parts.reduce((s: number, p: any) => s + p.price, 0);
    const otherCostsTotal = otherCostEntities.reduce((s, c) => s + (c.price ?? 0), 0);
    const totalHT = partsTotal + levelRepairPrice + otherCostsTotal;
    const tvaAmount = totalHT * (tva / 100);
    const totalTTC = totalHT + tvaAmount + timbreFiscale;

    invoice.details = {
      parts,
      levelRepairPrice,
      partsTotal,
      otherCosts: otherCostEntities.map(c => ({ id: c.id, name: c.name, price: c.price })),
      otherCostsTotal,
      totalHT,
      tva,
      tvaAmount,
      timbreFiscale,
      totalTTC,
    } as any;
    invoice.tva = tva;
    invoice.timbreFiscale = timbreFiscale;
    invoice.partsTotal = partsTotal;
    invoice.levelRepairPrice = levelRepairPrice;
    invoice.otherCostsTotal = otherCostsTotal;
    invoice.totalPrice = totalTTC;

    await this.invoiceRepositry.save(invoice);

    return invoice;
  }

  async validate(id: number, adminId: number): Promise<Invoice> {
    const admin = await this.userRepositry.findOne({ where: { id: adminId } });
    if (!admin || !admin.role?.includes('Administrateur')) {
      throw new BadRequestException('Seul un administrateur peut valider une facture');
    }

    const invoice = await this.invoiceRepositry.findOne({
      where: { id },
      relations: ['validatedBy'],
    });
    if (!invoice) {
      throw new NotFoundException('Facture introuvable');
    }
    if (invoice.state === 'Validé') {
      throw new BadRequestException('Facture déjà validée');
    }

    invoice.state = 'Validé';
    invoice.validatedBy = admin;
    invoice.validatedAt = new Date();

    return await this.invoiceRepositry.save(invoice);
  }

  async remove(id: number): Promise<Invoice> {
    const deletedata = await this.invoiceRepositry.findOne({ where: { id } });
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete = failed');
    }
    await this.invoiceRepositry.delete({ id: deletedata.id });
    return deletedata;
  }

  async findByBranchId(branchId: number): Promise<Invoice[]> {
    const findAll = await this.invoiceRepositry
      .createQueryBuilder("invoice")
      .leftJoinAndSelect("invoice.repair", "repair")
      .leftJoinAndSelect("repair.device", "device")
      .leftJoinAndSelect("device.model", "model")
      .leftJoinAndSelect("model.brand", "brand")
      .leftJoinAndSelect("repair.customer", "customer")
      .leftJoinAndSelect("invoice.otherCost", "otherCost")
      .leftJoinAndSelect("invoice.user", "user")
      .where("repair.actuellyBranch = :branchId", { branchId })
      .orderBy("invoice.date", "DESC")
      .getMany();
    return findAll;
  }

  async findByUserId(userId: number): Promise<Invoice[]> {
    const findAll = await this.invoiceRepositry
      .createQueryBuilder("invoice")
      .leftJoinAndSelect("invoice.repair", "repair")
      .leftJoinAndSelect("invoice.otherCost", "otherCost")
      .where("repair.user = :userId", { userId })
      .getMany();
    return findAll;
  }

  async findByRepairId(repairId: number): Promise<Invoice[]> {
    const findAll = await this.invoiceRepositry
      .createQueryBuilder("invoice")
      .leftJoinAndSelect("invoice.repair", "repair")
      .where("repair.id = :repairId", { repairId })
      .getMany();
    return findAll;
  }

  async findByState(state: string): Promise<Invoice[]> {
    const findAll = await this.invoiceRepositry
      .createQueryBuilder("invoice")
      .where("state = :state", { state })
      .getMany();
    return findAll;
  }

  async getEligibleRepairs(branchId: number): Promise<Repair[]> {
    return await this.repairRepositry
      .createQueryBuilder("repair")
      .leftJoinAndSelect("repair.repairAction", "repairAction")
      .leftJoinAndSelect("repair.device", "device")
      .leftJoinAndSelect("repair.customer", "customer")
      .leftJoinAndSelect("device.model", "model")
      .leftJoinAndSelect("model.brand", "brand")
      .leftJoinAndSelect("repair.user", "tech")
      .leftJoin("repair.invoice", "invoice")
      .where("repair.actuellyBranch = :branchId", { branchId })
      .andWhere("(repair.warrenty IS NULL OR repair.warrenty = false)")
      .andWhere("repairAction.name = :actionName", { actionName: 'Réparation' })
      .andWhere("invoice.id IS NULL")
      .orderBy("repair.id", "DESC")
      .getMany();
  }

  async getRepairInvoiceDetails(repairId: number) {
    const repair = await this.repairRepositry.findOne({
      where: { id: repairId },
      relations: ['device', 'device.model', 'repairAction'],
    });
    if (!repair) throw new NotFoundException('Repair not found');

    const companies = await this.companyRepositry.find({ take: 1 });
    const tva = companies[0]?.tva ?? 0;
    const timbreFiscale = companies[0]?.timbreFiscale ?? 0;

    const modelId = repair.device?.model?.id;
    const partIds: number[] = repair.partsNeed ?? [];

    let parts: any[] = [];
    let levelRepairPrice = 0;

    if (modelId && partIds.length > 0) {
      const partsPrices = await this.partsPriceRepositry.find({
        where: { model: { id: modelId }, allPart: { id: In(partIds) } },
        relations: ['allPart', 'levelRepair'],
      });

      parts = partsPrices.map(pp => ({
        partId: pp.allPart?.id ?? 0,
        partName: pp.allPart?.description ?? `Pièce #${pp.allPart?.id}`,
        price: pp.price ?? 0,
        levelRepairName: pp.levelRepair?.name ?? null,
        levelRepairPrice: pp.levelRepair?.price ?? 0,
      }));

      const levelPrices = partsPrices
        .map(pp => pp.levelRepair?.price ?? 0)
        .filter(p => p > 0);

      levelRepairPrice = levelPrices.length > 0 ? Math.max(...levelPrices) : 0;
    }

    const partsTotal = parts.reduce((s, p) => s + p.price, 0);

    return { repair, parts, partsTotal, levelRepairPrice, tva, timbreFiscale };
  }

  async getAuthorizedOtherCosts(): Promise<OtherCost[]> {
    return await this.otherCostRepositry.find({ where: { status: 'Autoriser' } });
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

  async generatePdf(id: number, res: any): Promise<void> {
    const PDFDocument = require('pdfkit');

    const invoice = await this.findOne(id);
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
}
