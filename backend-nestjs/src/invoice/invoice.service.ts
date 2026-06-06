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

}
