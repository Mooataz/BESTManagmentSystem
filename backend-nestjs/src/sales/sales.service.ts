import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { ApproveStock } from 'src/approve-stock/entities/approve-stock.entity';
import { User } from 'src/users/entities/user.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { PartsPrice } from 'src/parts-price/entities/parts-price.entity';
import { Bin } from 'src/bin/entities/bin.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private readonly saleRepositry: Repository<Sale>,
    @InjectRepository(AllPart) private readonly allPartRepositry: Repository<AllPart>,
    @InjectRepository(ApproveStock) private readonly approveStockRepositry: Repository<ApproveStock>,
    @InjectRepository(User) private readonly userRepositry: Repository<User>,
    @InjectRepository(StockPart) private readonly stockPartRepositry: Repository<StockPart>,
    @InjectRepository(PartsPrice) private readonly partsPriceRepositry: Repository<PartsPrice>,
    @InjectRepository(Bin) private readonly binRepositry: Repository<Bin>,
    @InjectRepository(Customer) private readonly customerRepositry: Repository<Customer>,
    @InjectRepository(Company) private readonly companyRepositry: Repository<Company>,
  ) { }

  private async upsertCustomer(name?: string, phone?: number): Promise<Customer | undefined> {
    if (!name && !phone) return undefined;
    const existing = await this.customerRepositry.findOne({ where: { name, phone } });
    if (existing) return existing;
    return await this.customerRepositry.save(this.customerRepositry.create({ name, phone }));
  }

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const { allPartIds, quantities, user, customerName, customerPhone, ...rest } = createSaleDto;

    const userEntity = user ? await this.userRepositry.findOne({ where: { id: user } }) : null;

    const allParts = allPartIds?.length
      ? await this.allPartRepositry.find({ where: { id: In(allPartIds) } })
      : [];

    const prices = allPartIds?.length
      ? await this.partsPriceRepositry.find({
          where: { allPart: { id: In(allPartIds) } },
          relations: ['allPart'],
        })
      : [];

    const items = allParts.map((ap, i) => {
      const qty = quantities?.[i] ?? 1;
      const partPrice = prices.find(p => p.allPart?.id === ap.id);
      return {
        allPartId: ap.id,
        allPartName: ap.description,
        quantity: qty,
        unitPrice: partPrice?.price ?? 0,
      };
    });

    const totalPrice = items.reduce((sum, it) => sum + (it.unitPrice ?? 0) * it.quantity, 0);

    const details = { items };

    const customer = await this.upsertCustomer(customerName, customerPhone);

    const newCreate = this.saleRepositry.create({
      ...rest,
      totalPrice: totalPrice,
      details,
      allPart: allParts.length ? allParts : undefined,
      user: userEntity ?? undefined,
      customer: customer ?? undefined,
      state: rest.state ?? 'En attente',
    });

    const saved = await this.saleRepositry.save(newCreate);

    if (allParts.length) {
      const approveEntries = allParts.map(ap =>
        this.approveStockRepositry.create({
          type: 'Vente',
          date: new Date(),
          state: 'En attente',
          idPartRepair: ap.id,
          sale: { id: saved.id },
        })
      );
      await this.approveStockRepositry.save(approveEntries);
    }

    return saved;
  }

  async findAll(): Promise<Sale[]> {
    return await this.saleRepositry.find({
      relations: ['allPart', 'user', 'approveStock', 'validatedBy', 'confirmedBy', 'customer'],
    });
  }

  async findOne(id: number): Promise<Sale> {
    const one = await this.saleRepositry.findOne({
      where: { id },
      relations: ['allPart', 'user', 'approveStock', 'validatedBy', 'confirmedBy', 'customer'],
    });
    if (!one) throw new NotFoundException('Sale not found');
    return one;
  }

  async findByBranchId(branchId: number): Promise<Sale[]> {
    return await this.saleRepositry
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.allPart', 'allPart')
      .leftJoinAndSelect('sale.user', 'user')
      .leftJoinAndSelect('user.branch', 'branch')
      .leftJoinAndSelect('sale.approveStock', 'approveStock')
      .leftJoinAndSelect('sale.validatedBy', 'validatedBy')
      .leftJoinAndSelect('sale.confirmedBy', 'confirmedBy')
      .leftJoinAndSelect('sale.customer', 'customer')
      .where('branch.id = :branchId', { branchId })
      .orderBy('sale.date', 'DESC')
      .getMany();
  }

  async findByUserId(userId: number): Promise<Sale[]> {
    return await this.saleRepositry
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.allPart', 'allPart')
      .leftJoinAndSelect('sale.user', 'user')
      .leftJoinAndSelect('sale.approveStock', 'approveStock')
      .leftJoinAndSelect('sale.validatedBy', 'validatedBy')
      .leftJoinAndSelect('sale.confirmedBy', 'confirmedBy')
      .leftJoinAndSelect('sale.customer', 'customer')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async findByState(state: string): Promise<Sale[]> {
    return await this.saleRepositry
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.allPart', 'allPart')
      .leftJoinAndSelect('sale.user', 'user')
      .leftJoinAndSelect('sale.approveStock', 'approveStock')
      .leftJoinAndSelect('sale.validatedBy', 'validatedBy')
      .leftJoinAndSelect('sale.confirmedBy', 'confirmedBy')
      .leftJoinAndSelect('sale.customer', 'customer')
      .where('sale.state = :state', { state })
      .getMany();
  }

  async update(id: number, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.saleRepositry.findOne({ where: { id }, relations: ['allPart', 'approveStock'] });
    if (!sale) throw new NotFoundException('Sale not found');

    const { allPartIds, quantities, user, customerName, customerPhone, ...rest } = updateSaleDto as any;

    Object.assign(sale, rest);

    if (customerName !== undefined || customerPhone !== undefined) {
      sale.customer = await this.upsertCustomer(customerName, customerPhone);
    }

    if (allPartIds !== undefined) {
      const allParts = allPartIds.length
        ? await this.allPartRepositry.find({ where: { id: In(allPartIds) } })
        : [];
      sale.allPart = allParts;

      const prices = allPartIds.length
        ? await this.partsPriceRepositry.find({
            where: { allPart: { id: In(allPartIds) } },
            relations: ['allPart'],
          })
        : [];

      const items = allParts.map((ap, i) => {
        const qty = quantities?.[i] ?? 1;
        const partPrice = prices.find(p => p.allPart?.id === ap.id);
        return {
          allPartId: ap.id,
          allPartName: ap.description,
          quantity: qty,
          unitPrice: partPrice?.price ?? 0,
        };
      });
      sale.details = { items } as any;
      sale.totalPrice = items.reduce((sum, it) => sum + (it.unitPrice ?? 0) * it.quantity, 0);
    }

    if (user !== undefined) {
      const userEntity = await this.userRepositry.findOne({ where: { id: user } });
      if (userEntity) sale.user = userEntity;
    }

    await this.saleRepositry.save(sale);
    return sale;
  }

  async findForSale(saleId: number, branchId: number): Promise<any[]> {
    const sale = await this.saleRepositry.findOne({
      where: { id: saleId },
      relations: ['allPart'],
    });
    if (!sale) throw new NotFoundException('Sale not found');

    const items = (sale.details as any)?.items ?? [];
    const allPartIds = items.map((it: any) => it.allPartId);
    if (!allPartIds.length) return [];

    const stockParts = await this.stockPartRepositry
      .createQueryBuilder('stockPart')
      .leftJoinAndSelect('stockPart.bin', 'bin')
      .leftJoinAndSelect('bin.branch', 'branch')
      .leftJoinAndSelect('stockPart.reference', 'reference')
      .leftJoinAndSelect('reference.allpart', 'allpart')
      .where('branch.id = :branchId', { branchId })
      .andWhere('bin.type = :type', { type: 'Bon' })
      .andWhere('allpart.id IN (:...allPartIds)', { allPartIds })
      .getMany();

    const prices = await this.partsPriceRepositry.find({
      where: { allPart: { id: In(allPartIds) } },
      relations: ['allPart'],
    });

    return stockParts.map(sp => ({
      id: sp.id,
      serialNumber: sp.serialNumber,
      reference: sp.reference
        ? { id: sp.reference.id, materialCode: sp.reference.materialCode, description: sp.reference.description }
        : null,
      allPart: sp.reference?.allpart
        ? { id: sp.reference.allpart.id, description: sp.reference.allpart.description }
        : null,
      bin: sp.bin
        ? { id: sp.bin.id, name: sp.bin.name }
        : null,
      price: prices.find(p => p.allPart?.id === sp.reference?.allpart?.id)?.price ?? null,
    }));
  }

  async batchChangeBin(stockPartIds: number[], binId: number, userId: number, saleId: number): Promise<{ updated: number }> {
    const sale = await this.saleRepositry.findOne({ where: { id: saleId }, relations: ['confirmedBy'] });
    if (!sale) throw new NotFoundException('Sale not found');
    if (sale.confirmedAt) throw new BadRequestException('Stock déjà confirmé pour cette vente');

    const bin = await this.binRepositry.findOne({ where: { id: binId } });
    if (!bin) throw new NotFoundException('Bin not found');

    const user = await this.userRepositry.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    for (const id of stockPartIds) {
      await this.stockPartRepositry.update(id, { bin: { id: binId } });
    }

    await this.approveStockRepositry.update(
      { sale: { id: saleId } },
      { state: 'Confirmé' },
    );

    await this.saleRepositry.update(saleId, {
      state: 'Confirmé',
      confirmedBy: { id: userId },
      confirmedAt: new Date(),
    });

    return { updated: stockPartIds.length };
  }

  async validate(id: number, adminId: number): Promise<Sale> {
    const admin = await this.userRepositry.findOne({ where: { id: adminId } });
    if (!admin || !admin.role?.includes('Administrateur')) {
      throw new BadRequestException('Seul un administrateur peut valider une vente');
    }

    const sale = await this.saleRepositry.findOne({ where: { id }, relations: ['validatedBy'] });
    if (!sale) throw new NotFoundException('Vente introuvable');
    if (sale.state === 'Validé') throw new BadRequestException('Vente déjà validée');
    if (sale.state !== 'Confirmé') throw new BadRequestException('La vente doit être confirmée en stock avant validation');

    sale.state = 'Validé';
    sale.validatedBy = admin;
    sale.validatedAt = new Date();
    return await this.saleRepositry.save(sale);
  }

  async getAccessories(): Promise<AllPart[]> {
    return await this.allPartRepositry.find({
      where: { description: In(['Chargeur', 'Ecouteur', 'Câble USB']) },
    });
  }

  async remove(id: number): Promise<Sale> {
    const deletedata = await this.saleRepositry.findOne({ where: { id } });
    if (!deletedata) throw new NotFoundException('Sale not found');
    await this.saleRepositry.delete({ id: deletedata.id });
    return deletedata;
  }

  async generatePdf(id: number, res: any): Promise<void> {
    const PDFDocument = require('pdfkit');

    const sale = await this.saleRepositry.findOne({
      where: { id },
      relations: ['user', 'user.branch', 'validatedBy', 'confirmedBy', 'customer'],
    });
    if (!sale) throw new NotFoundException('Sale not found');
    if (sale.state !== 'Confirmé' && sale.state !== 'Validé') {
      throw new BadRequestException('La vente doit être confirmée pour générer le PDF');
    }

    const items: any[] = (sale.details as any)?.items ?? [];
    const totalHT = items.reduce((s: number, it: any) => s + (it.unitPrice ?? 0) * (it.quantity ?? 1), 0);

    const companies = await this.companyRepositry.find({ take: 1 });
    const company = companies[0] ?? {};
    const tva = (company as any).tva ?? 0;
    const timbreFiscale = (company as any).timbreFiscale ?? 0;
    const tvaAmount = totalHT * (tva / 100);
    const totalTTC = totalHT + tvaAmount + timbreFiscale;

    const branch = (sale.user as any)?.branch ?? {};
    const customer = sale.customer;

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="vente_${sale.id}.pdf"`);
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
      (company as any).name ?? 'VENTE', { align: 'center' }
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
    doc.text(`N° Vente: ${sale.id}`, { align: 'right' });
    doc.text(`Date: ${new Date(sale.date ?? new Date()).toLocaleDateString('fr-FR')}`, { align: 'right' });
    doc.text(`Créée par: ${(sale.user as any)?.name ?? '-'}`, { align: 'right' });
    doc.moveDown(1);

    if (customer) {
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#333').text('Client');
      doc.fontSize(10).font('Helvetica').fillColor('#333');
      doc.text(`Nom: ${customer.name || '-'}`);
      doc.text(`Tél: ${customer.phone || '-'}`);
      doc.moveDown(0.5);
      doc.moveTo(40, doc.y).lineTo(40 + pageWidth, doc.y).strokeColor('#ddd').stroke();
      doc.moveDown(0.5);
    }

    doc.fontSize(11).font('Helvetica-Bold').fillColor('#333').text('Accessoires');
    doc.moveDown(0.3);

    const tableTop = doc.y;
    const col1 = 40, col2 = 300, col3 = 450, col4 = 520;

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#fff');
    doc.rect(col1, tableTop, pageWidth, 18).fill(primary);
    doc.fillColor('#fff');
    doc.text('Accessoire', col1 + 5, tableTop + 4);
    doc.text('Qté', col2, tableTop + 4, { width: 40, align: 'left' });
    doc.text('P.U', col3, tableTop + 4, { width: 60, align: 'left' });
    doc.text('Total', col4, tableTop + 4, { width: 60, align: 'left' });

    let y = tableTop + 22;
    doc.fontSize(9).font('Helvetica').fillColor('#333');

    for (const item of items) {
      const lineTotal = (item.unitPrice ?? 0) * (item.quantity ?? 1);
      doc.text(item.allPartName || `Pièce #${item.allPartId}`, col1 + 5, y);
      doc.text(`${item.quantity}`, col2, y, { width: 40, align: 'left' });
      doc.text(`${(item.unitPrice ?? 0).toFixed(3)}`, col3, y, { width: 60, align: 'left' });
      doc.text(`${lineTotal.toFixed(3)}`, col4, y, { width: 60, align: 'left' });
      y += 18;
    }

    doc.moveTo(col1, y).lineTo(col1 + pageWidth, y).strokeColor('#ddd').stroke();
    y += 8;

    doc.fontSize(10).font('Helvetica');
    doc.text('Total HT', 380, y, { width: 100, align: 'left' });
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
    y += 30;

    const footerY = doc.page.height - 100;
    doc.moveTo(40, footerY).lineTo(40 + pageWidth, footerY).strokeColor('#ddd').stroke();
    doc.fontSize(8).font('Helvetica-Bold').fillColor(primary);
    doc.text(`Agence: ${branch.name ?? '-'}`, 40, footerY + 8, { continued: true });
    doc.text(`  |  ${branch.location ?? ''}`, { continued: true });
    doc.text(`  |  Tél: ${branch.phone ?? ''}`, { continued: true });
    doc.text(`  |  ${branch.email ?? ''}`, { align: 'right' });

    doc.fontSize(7).font('Helvetica').fillColor(gray);
    doc.text(`${(company as any).name ?? ''} — ${(company as any).taxRegisterNumber ?? ''} — RIB: ${(company as any).rib ?? ''} ${(company as any).bank ?? ''}`, 40, footerY + 20, { align: 'center' });

    if ((company as any).logo) {
      try {
        const logoPath = require('path').join(process.cwd(), 'upload', 'company', (company as any).logo);
        doc.image(logoPath, 40, footerY + 34, { width: 60 });
      } catch { }
    }

    doc.end();
  }
}