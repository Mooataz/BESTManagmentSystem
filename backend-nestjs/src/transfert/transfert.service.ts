import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransfertDto } from './dto/create-transfert.dto';
import { UpdateTransfertDto } from './dto/update-transfert.dto';
import { AcceptTransfertDto } from './dto/accept-transfert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfert } from './entities/transfert.entity';
import { In, Repository } from 'typeorm';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { User } from 'src/users/entities/user.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { HistoryRepair } from 'src/history-repair/entities/history-repair.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { StockPartsService } from 'src/stock-parts/stock-parts.service';
import { HistoryStockPartService } from 'src/history-stock-part/history-stock-part.service';

@Injectable()
export class TransfertService {
  constructor(
    @InjectRepository(Transfert) private readonly transfertRepositry: Repository<Transfert>,
    @InjectRepository(StockPart) private readonly stockPartRepositry: Repository<StockPart>,
    @InjectRepository(Repair) private readonly repairRepositry: Repository<Repair>,
    private readonly stockPartsService: StockPartsService,
    @InjectRepository(User) private readonly userRepositry: Repository<User>,
    @InjectRepository(Branch) private readonly branchRepositry: Repository<Branch>,
    @InjectRepository(HistoryRepair) private readonly historyRepairRepositry: Repository<HistoryRepair>,
    @InjectRepository(Tracability) private readonly tracabilityRepositry: Repository<Tracability>,
    private readonly historyStockPartService: HistoryStockPartService,
  ) { }

  async create(createTransfertDto: CreateTransfertDto): Promise<Transfert> {

    const stockPart = await this.stockPartRepositry.find({
      where: { id: In(createTransfertDto.stockPartIds ?? []) },
    });
    const repair = await this.repairRepositry.find({
      where: { id: In(createTransfertDto.repairIds ?? []) },
      relations: ['historyRepair'],
    });

    if ((!stockPart.length) && (!repair.length)) { throw new NotFoundException('No data for transfert') };

    let newCreate;
    if (repair.length) {
      const previousStep = this.getLatestRepairStep(repair[0]) ?? undefined;
      for (const r of repair) {
        const step = this.getLatestRepairStep(r);
        if (!step || !['On affectation', 'CQ'].includes(step)) {
          throw new BadRequestException(
            `La réparation #${r.id} a le statut "${step ?? 'aucun'}" – seul "On affectation" ou "CQ" est autorisé.`,
          );
        }
      }
      newCreate = this.transfertRepositry.create({ ...createTransfertDto, repair, type: 'Repair', previousStep });
      await this.repairRepositry
        .createQueryBuilder()
        .update(Repair)
        .set({ actuellybranch: 0 })
        .where('id IN (:...ids)', { ids: repair.map(p => p.id) })
        .execute();
      for (const r of repair) {
        await this.addRepairHistory(r.id, 'En transfert', createTransfertDto.sendUser ?? 0);
      }
    } else {
      newCreate = this.transfertRepositry.create({ ...createTransfertDto, stockPart })
      await this.stockPartRepositry
        .createQueryBuilder()
        .update(StockPart)
        .set({ bin: () => 'NULL' })
        .where('id IN (:...ids)', { ids: stockPart.map(p => p.id) })
        .execute();
    }

    const saved = await this.transfertRepositry.save(newCreate);

    if (stockPart.length) {
      const fromBranch = await this.branchRepositry.findOne({ where: { id: createTransfertDto.frombranch } });
      const branchName = fromBranch?.name ?? String(createTransfertDto.frombranch);
      for (const sp of stockPart) {
        await this.historyStockPartService.create({
          stockPart: sp.id,
          user: { id: createTransfertDto.sendUser },
          step: `Transfert de agence ${branchName}`,
          date: new Date(),
        });
      }
    }

    return saved;
  }

  async findAll(): Promise<Transfert[]> {
    return await this.transfertRepositry.find()
  }

  async findOne(id: number): Promise<Transfert> {
    const findOne = await this.transfertRepositry.findOne({ where: { id } })
    if (!findOne) {
      throw new NotFoundException("There is no Transfert available")
    }
    return findOne
  }

 /*  async update(id: number,   updateTransfertDto: UpdateTransfertDto   data: any): Promise<Transfert> {

    const stockPart = await this.stockPartRepositry.find({
      where: { id: In(data.stockPartIds ?? []) },
    });
    const repair = await this.repairRepositry.find({
      where: { id: In(data.repairIds ?? []) },
    });
    if ((!stockPart.length) && (!repair.length)) { throw new NotFoundException('No data for transfert') };
    let newCreate
    if (!stockPart.length) {
      newCreate = this.transfertRepositry.update({ ...data, repair })
      await this.repairRepositry
        .createQueryBuilder()
        .update(Repair)
        .set({ actuellybranch: data.actuellybranch}) // ici on met un nombre, pas une fonction
        .where('id IN (:...ids)', { ids: repair.map(p => p.id) })
        .execute();

    } else {
      newCreate = this.transfertRepositry.update({ ...data, stockPart })
      await this.stockPartRepositry
        .createQueryBuilder()
        .update(StockPart)
        .set({ bin: () => data.bin })
        .where('id IN (:...ids)', { ids: stockPart.map(p => p.id) })
        .execute();
    }
     await this.transfertRepositry.update(id, data);  
    const updatedata = await this.transfertRepositry.findOne({ where: { id } })
    if (!updatedata) {
      throw new NotFoundException('Transfert Not found for update = failed')
    }

    return updatedata
  } */
async update(id: number, data: any): Promise<Transfert> {
  const stockPart = await this.stockPartRepositry.find({
    where: { id: In(data.stockPartIds ?? []) },
  });

  const repair = await this.repairRepositry.find({
    where: { id: In(data.repairIds ?? []) },
  });

  // Récupérer le transfert à modifier
  const transfert = await this.transfertRepositry.findOne({
    where: { id },
  });

  if (!transfert) {
    throw new NotFoundException('Transfert Not found for update = failed');
  }

  // Mise à jour des entités associées selon le type de transfert
  if (repair.length) {
    await this.repairRepositry
      .createQueryBuilder()
      .update(Repair)
      .set({ actuellybranch: data.actuellybranch })
      .where('id IN (:...ids)', { ids: repair.map(p => p.id) })
      .execute();
  }

  if (stockPart.length) {
    const stockPartIds = stockPart.map(p => p.id);
    await this.stockPartRepositry
      .createQueryBuilder()
      .update(StockPart)
      .set({ bin: data.bin })
      .where('id IN (:...ids)', { ids: stockPartIds })
      .execute();
    const toBranch = await this.branchRepositry.findOne({ where: { id: transfert.tobranch } });
    const branchName = toBranch?.name ?? String(transfert.tobranch);
    for (const sp of stockPart) {
      await this.historyStockPartService.create({
        stockPart: sp.id,
        user: { id: data.receiveUser ?? 0 },
        step: `Transfert accepté agence ${branchName}`,
        date: new Date(),
      });
    }
  }

  // Mettre à jour les données simples
  Object.assign(transfert, data);

  // Sauvegarder le tout
  return await this.transfertRepositry.save(transfert);
}

async acceptTransfert(id: number, data: any): Promise<Transfert> {
  const transfert = await this.transfertRepositry.findOne({ where: { id } });
  if (!transfert) {
    throw new NotFoundException('Transfert non trouvé');
  }

  transfert.state = data.state ?? transfert.state;
  transfert.receivedDate = data.receivedDate ?? transfert.receivedDate;
  transfert.receiveUser = data.receiveUser ?? transfert.receiveUser;

  const saved = await this.transfertRepositry.save(transfert);

  const stockPartIds = data.stockPartIds ?? [];
  
  if (stockPartIds.length > 0 && data.bin != null) {
    for (const spId of stockPartIds) {
      await this.stockPartsService.update(spId, { bin: data.bin } as any);
    }
  }

  if (stockPartIds.length > 0) {
    const toBranch = await this.branchRepositry.findOne({ where: { id: transfert.tobranch } });
    const branchName = toBranch?.name ?? String(transfert.tobranch);
    for (const spId of stockPartIds) {
      await this.historyStockPartService.create({
        stockPart: spId,
        user: { id: data.receiveUser ?? 0 },
        step: `Transfert accepté agence ${branchName}`,
        date: new Date(),
      });
    }
  }

  return saved;
}

  async remove(id: number): Promise<Transfert> {
    const deletedata = await this.transfertRepositry.findOne({ where: { id } });
    if (!deletedata) {
      throw new NotFoundException('Transfert Not found for delete = failed')
    }
    await this.transfertRepositry.delete({ id: deletedata.id })
    return deletedata;
  }


  private async addRepairHistory(repairId: number, step: string, userId: number): Promise<void> {
    const repair = await this.repairRepositry.findOne({ where: { id: repairId } });
    if (!repair) throw new NotFoundException('Repair not found');
    const user = await this.userRepositry.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const history = this.historyRepairRepositry.create({ step, date: new Date(), repair });
    const saved = await this.historyRepairRepositry.save(history);
    const trac = this.tracabilityRepositry.create({ user, historyRepair: saved });
    await this.tracabilityRepositry.save(trac);
  }

  private getLatestRepairStep(repair: Repair): string | null {
    if (!repair.historyRepair || repair.historyRepair.length === 0) return null;
    const sorted = [...repair.historyRepair].sort(
      (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
    );
    return sorted[0]?.step ?? null;
  }

  async findRepairTransfersByBranch(branchId: number): Promise<Transfert[]> {
    return await this.transfertRepositry.find({
      where: [
        { frombranch: branchId, type: 'Repair' },
        { tobranch: branchId, type: 'Repair' },
      ],
      relations: ['repair', 'repair.customer', 'repair.device', 'repair.device.model', 'repair.device.model.brand', 'repair.historyRepair'],
      order: { id: 'DESC' },
    });
  }

  async acceptRepairTransfer(id: number, userId: number): Promise<Transfert> {
    const transfert = await this.transfertRepositry.findOne({
      where: { id, type: 'Repair', state: 'Envoyé' },
      relations: ['repair', 'repair.historyRepair'],
    });
    if (!transfert) throw new NotFoundException('Transfert non trouvé ou déjà traité.');
    if (!transfert.tobranch) throw new BadRequestException('Aucune branche de destination.');

    transfert.state = 'Reçu';
    transfert.receiveUser = userId;
    transfert.receivedDate = new Date();
    const saved = await this.transfertRepositry.save(transfert);

    for (const repair of transfert.repair ?? []) {
      repair.actuellybranch = transfert.tobranch;
      await this.repairRepositry.save(repair);
      await this.addRepairHistory(repair.id, transfert.previousStep ?? 'On affectation', userId);
    }

    return saved;
  }

  async refuseRepairTransfer(id: number, userId: number): Promise<Transfert> {
    const transfert = await this.transfertRepositry.findOne({
      where: { id, type: 'Repair', state: 'Envoyé' },
      relations: ['repair'],
    });
    if (!transfert) throw new NotFoundException('Transfert non trouvé ou déjà traité.');

    transfert.state = 'Refusé';
    transfert.receiveUser = userId;
    transfert.receivedDate = new Date();
    const saved = await this.transfertRepositry.save(transfert);

    for (const repair of transfert.repair ?? []) {
      repair.actuellybranch = transfert.frombranch ?? repair.actuellybranch;
      await this.repairRepositry.save(repair);
      await this.addRepairHistory(repair.id, transfert.previousStep ?? 'On affectation', userId);
    }

    return saved;
  }

  async cancelRepairTransfer(id: number, userId: number): Promise<Transfert> {
    const transfert = await this.transfertRepositry.findOne({
      where: { id, type: 'Repair', state: 'Envoyé' },
      relations: ['repair'],
    });
    if (!transfert) throw new NotFoundException('Transfert non trouvé ou déjà traité.');

    transfert.state = 'Annulé';
    const saved = await this.transfertRepositry.save(transfert);

    for (const repair of transfert.repair ?? []) {
      repair.actuellybranch = transfert.frombranch ?? repair.actuellybranch;
      await this.repairRepositry.save(repair);
      await this.addRepairHistory(repair.id, transfert.previousStep ?? 'On affectation', userId);
    }

    return saved;
  }

  async findByState(state: string): Promise<Transfert[]> {
    const findAll = await this.transfertRepositry
      .createQueryBuilder('transfert')
      .where('state = :state', { state })
      .getMany();

    return findAll
  }

  async getFromBranch(branchId: number, type: string): Promise<any[]> {
    const transferts = await this.transfertRepositry
      .createQueryBuilder('transfert')
      .leftJoinAndSelect('transfert.stockPart', 'stockPart')
      .leftJoinAndSelect('stockPart.reference', 'reference')
      .leftJoinAndSelect('reference.allpart', 'allpart')
      .leftJoinAndSelect('reference.model', 'model')
      .leftJoinAndSelect('stockPart.bin', 'bin')
      .where('transfert.frombranch = :branchId', { branchId })
      .andWhere('transfert.type = :type', { type })
      .orderBy('transfert.id', 'DESC')
      .getMany();
    const result: any[] = [];
    for (const t of transferts) {
      const [sendUser, receiveUser, fromBranch, toBranch] = await Promise.all([
        this.userRepositry.findOne({ where: { id: t.sendUser } }),
        t.receiveUser ? this.userRepositry.findOne({ where: { id: t.receiveUser } }) : null,
        this.branchRepositry.findOne({ where: { id: t.frombranch } }),
        this.branchRepositry.findOne({ where: { id: t.tobranch } }),
      ]);
      const stockPartsDetail = t.stockPart?.map(sp => ({
        id: sp.id,
        serialnumber: sp.serialNumber,
        remark: sp.remark,
        binName: sp.bin?.name ?? null,
        materialCode: sp.reference?.materialCode ?? null,
        model: sp.reference?.model ?? null,
        partDescription: sp.reference?.allpart?.description ?? null,

      }));
      result.push({
        delivredBy: t.delivredBy,
        transfertId: t.id,
        sendingDate: t.sendingDate,
        receivedDate: t.receivedDate,
        type: t.type,
        state: t.state,
        remark: t.remark,
        sendUserName: sendUser?.name || null,
        receiveUserName: receiveUser?.name || null,
        fromBranchName: fromBranch?.name || null,
        toBranchName: toBranch?.name || null,
        stockPartIds: t.stockPart?.map(sp => sp.id) ?? [],
        stockPart: stockPartsDetail
      });
    }
    return result;
  }


  async getToBranch(branchId: number, type: string, state: string): Promise<any[]> {

    const query = this.transfertRepositry
      .createQueryBuilder('transfert')
      .leftJoinAndSelect('transfert.stockPart', 'stockPart')
      .leftJoinAndSelect('stockPart.reference', 'reference')
      .leftJoinAndSelect('reference.allpart', 'allpart')
      .leftJoinAndSelect('reference.model', 'model')
      .leftJoinAndSelect('stockPart.bin', 'bin')
      .where('transfert.tobranch = :branchId', { branchId })
      .andWhere('transfert.type = :type', { type });

    if (state !== 'all') {
      query.andWhere('transfert.state = :state', { state });
    }

    query.orderBy('transfert.id', 'DESC');

    const transferts = await query.getMany();
    const result: any[] = [];
    for (const t of transferts) {
      const [sendUser, receiveUser, fromBranch, toBranch] = await Promise.all([
        this.userRepositry.findOne({ where: { id: t.sendUser } }),
        t.receiveUser ? this.userRepositry.findOne({ where: { id: t.receiveUser } }) : null,
        this.branchRepositry.findOne({ where: { id: t.frombranch } }),
        this.branchRepositry.findOne({ where: { id: t.tobranch } }),
      ]);
      const stockPartsDetail = t.stockPart?.map(sp => ({
        id: sp.id,
        serialnumber: sp.serialNumber,
        remark: sp.remark,
        binName: sp.bin?.name ?? null,
        materialCode: sp.reference?.materialCode ?? null,
        model: sp.reference?.model ?? null,
        partDescription: sp.reference?.allpart?.description ?? null,

      }));
      result.push({
        delivredBy: t.delivredBy,
        transfertId: t.id,
        sendingDate: t.sendingDate,
        receivedDate: t.receivedDate,
        type: t.type,
        state: t.state,
        remark: t.remark,
        sendUserName: sendUser?.name || null,
        receiveUserName: receiveUser?.name || null,
        fromBranchName: fromBranch?.name || null,
        toBranchName: toBranch?.name || null,
        stockPartIds: t.stockPart?.map(sp => sp.id) ?? [],
        stockPart: stockPartsDetail
      });
    }
    return result;


  }

  async getOneWithDetails(id: number): Promise<any> {
    const transfert = await this.transfertRepositry
      .createQueryBuilder('transfert')
      .leftJoinAndSelect('transfert.stockPart', 'stockPart')
      .leftJoinAndSelect('stockPart.reference', 'reference')
      .leftJoinAndSelect('reference.allpart', 'allpart')
      .leftJoinAndSelect('reference.model', 'model')
      .leftJoinAndSelect('stockPart.bin', 'bin')
      .leftJoinAndSelect('transfert.repair', 'repair')
      .leftJoinAndSelect('repair.customer', 'cust')
      .leftJoinAndSelect('repair.device', 'dev')
      .leftJoinAndSelect('dev.model', 'mdl')
      .leftJoinAndSelect('mdl.brand', 'brnd')
      .where('transfert.id = :id', { id })
      .getOne();
    if (!transfert) {
      throw new NotFoundException('Transfert not found');
    }
    const [sendUser, receiveUser, fromBranch, toBranch] = await Promise.all([
      this.userRepositry.findOne({ where: { id: transfert.sendUser } }),
      transfert.receiveUser ? this.userRepositry.findOne({ where: { id: transfert.receiveUser } }) : null,
      this.branchRepositry.findOne({ where: { id: transfert.frombranch }, relations: ['company'] }),
      this.branchRepositry.findOne({ where: { id: transfert.tobranch }, relations: ['company'] }),
    ]);
    const stockPartsDetail = transfert.stockPart?.map(sp => ({
      id: sp.id,
      serialnumber: sp.serialNumber,
      remark: sp.remark,
      binName: sp.bin?.name ?? null,
      materialCode: sp.reference?.materialCode ?? null,
      model: sp.reference?.model?.[0]?.name ?? null,
      partDescription: sp.reference?.allpart?.description ?? null,
    }));
    const repairsDetail = transfert.repair?.map(r => ({
      id: r.id,
      customerName: r.customer?.name ?? '—',
      customerPhone: r.customer?.phone ?? '—',
      brand: r.device?.model?.brand?.name ?? '',
      model: r.device?.model?.name ?? '',
      serial: r.device?.serialenumber ?? '',
      actuellybranch: r.actuellybranch,
    }));
    const company = fromBranch?.company ?? toBranch?.company;
    return {
      delivredBy: transfert.delivredBy,
      transfertId: transfert.id,
      sendingDate: transfert.sendingDate,
      receivedDate: transfert.receivedDate,
      type: transfert.type,
      state: transfert.state,
      remark: transfert.remark,
      sendUserName: sendUser?.name || null,
      receiveUserName: receiveUser?.name || null,
      fromBranchName: fromBranch?.name || null,
      fromBranchLocation: fromBranch?.location || null,
      fromBranchPhone: fromBranch?.phone || null,
      fromBranchEmail: fromBranch?.email || null,
      toBranchName: toBranch?.name || null,
      toBranchLocation: toBranch?.location || null,
      toBranchPhone: toBranch?.phone || null,
      toBranchEmail: toBranch?.email || null,
      companyName: company?.name ?? null,
      companyLocation: company?.headquarterslocation ?? null,
      companyTaxReg: company?.taxRegisterNumber ?? null,
      companyRib: company?.rib ?? null,
      companyBank: company?.bank ?? null,
      companyLogo: company?.logo ?? null,
      stockPart: stockPartsDetail,
      repair: repairsDetail,
    };
  }

  async generatePdf(id: number, res: any): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const t = await this.getOneWithDetails(id);
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument({ margin: 45, bufferPages: true, size: 'A4' });
        doc.pipe(res);

        doc.on('finish', () => resolve());
        doc.on('error', (err: any) => reject(err));

        const pw = doc.page.width - 90;

        // ── Header bar ──
        doc.rect(0, 0, doc.page.width, 60);
        doc.fillColor('#2950ba').fill();
        doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold').text('BON DE TRANSFERT', 45, 18, { align: 'center' });

        // ── Company info block ──
        let y = 72;
        if (t.companyName) {
          if (t.companyLogo) {
            try { doc.image(`./upload/company/${t.companyLogo}`, 45, y - 8, { width: 45 }); } catch (_) {}
          }
          const logoOffset = t.companyLogo ? 55 : 0;
          doc.fillColor('#2950ba').fontSize(9).font('Helvetica-Bold').text(t.companyName, 45 + logoOffset, y);
          const companyLines = [
            t.companyLocation ? `Siège: ${t.companyLocation}` : null,
            t.companyTaxReg ? `MF: ${t.companyTaxReg}` : null,
            t.companyRib ? `RIB: ${t.companyRib}` : null,
            t.companyBank ? `Banque: ${t.companyBank}` : null,
          ].filter(Boolean) as string[];
          doc.fillColor('#555555').fontSize(7).font('Helvetica');
          companyLines.forEach((line, i) => doc.text(line, 45 + logoOffset, y + 12 + i * 10));
          const maxLines = Math.max(1, companyLines.length);
          y += 16 + maxLines * 10;
        }
        y += 8;
        const lbl = (text: string, x: number) => doc.fillColor('#666666').fontSize(7.5).font('Helvetica-Bold').text(text, x, y);
        const val = (v: string, x: number, w: number) => doc.fillColor('#222222').fontSize(9.5).font('Helvetica').text(v, x, y + 11, { width: w });

        // Row 1
        lbl('N° TRANSFERT', 45); val(String(t.transfertId), 45, 90);
        lbl('DATE ENVOI', 170); val(t.sendingDate ? new Date(t.sendingDate).toLocaleString('fr-FR') : '-', 170, 90);
        lbl('TYPE', 295); val('Réparation', 295, 70);
        const stateColors: Record<string, string[]> = { Envoyé: ['#2950ba', '#ffffff'], Reçu: ['#009650', '#ffffff'], Annulé: ['#c83c3c', '#ffffff'] };
        const sc = stateColors[t.state || ''] ?? ['#888888', '#ffffff'];
        const stateX = 420;
        doc.roundedRect(stateX - 4, y + 8, 90, 18, 4);
        doc.fillColor(sc[0]).fill();
        doc.fillColor(sc[1]).fontSize(8).font('Helvetica-Bold').text(t.state || '-', stateX, y + 12, { width: 82, align: 'center' });
        y += 40;

        // ── Origin / Destination cards ──
        const cardW = (pw - 15) / 2;
        const cardH = 76;
        const cardY = y;
        const drawCard = (title: string, lines: string[], x: number) => {
          doc.roundedRect(x, cardY, cardW, cardH, 5);
          doc.fillColor('#eef2f7').fill();
          doc.strokeColor('#2950ba').lineWidth(1).stroke();
          doc.fillColor('#2950ba').fontSize(10).font('Helvetica-Bold').text(title, x + 10, cardY + 6);
          doc.fillColor('#222222').fontSize(8).font('Helvetica');
          lines.forEach((l, i) => doc.text(l, x + 10, cardY + 22 + i * 12));
        };
        const fromLines = [
          t.fromBranchName || '—',
          t.fromBranchLocation ? `Adresse: ${t.fromBranchLocation}` : null,
          t.fromBranchPhone ? `Tél: ${t.fromBranchPhone}` : null,
          t.fromBranchEmail ? `Email: ${t.fromBranchEmail}` : null,
          `Envoyé par: ${t.sendUserName || '—'}`,
        ].filter(Boolean) as string[];
        const toLines = [
          t.toBranchName || '—',
          t.toBranchLocation ? `Adresse: ${t.toBranchLocation}` : null,
          t.toBranchPhone ? `Tél: ${t.toBranchPhone}` : null,
          t.toBranchEmail ? `Email: ${t.toBranchEmail}` : null,
          t.receiveUserName ? `Accepté par: ${t.receiveUserName}` : 'En attente',
        ].filter(Boolean) as string[];
        drawCard('DÉPART', fromLines, 45);
        drawCard('DESTINATION', toLines, 45 + cardW + 15);
        y = cardY + cardH + 12;

        // ── Extra infos ──
        const extraItems: { label: string; value: string }[] = [];
        if (t.delivredBy) extraItems.push({ label: 'LIVRÉ PAR', value: t.delivredBy });
        if (t.receivedDate) extraItems.push({ label: 'DATE RÉCEPTION', value: new Date(t.receivedDate).toLocaleString('fr-FR') });
        if (t.remark) extraItems.push({ label: 'REMARQUE', value: t.remark });
        if (extraItems.length) {
          doc.roundedRect(45, y, pw, 20 + extraItems.length * 16, 4);
          doc.fillColor('#f9fafc').fill();
          doc.fillColor('#222222');
          extraItems.forEach((item, i) => {
            doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#666666').text(item.label, 55, y + 8 + i * 16);
            doc.fontSize(9).font('Helvetica').fillColor('#222222').text(item.value, 130, y + 8 + i * 16, { width: pw - 140 });
          });
          y += 24 + extraItems.length * 16;
        }

        // ── Separator ──
        doc.strokeColor('#2950ba').lineWidth(0.5).moveTo(45, y).lineTo(doc.page.width - 45, y).stroke();
        y += 14;

        // ── Items table (repairs or stock parts) ──
        const title = t.type === 'Repair' ? 'RÉPARATIONS TRANSFÉRÉES' : 'PIÈCES TRANSFÉRÉES';
        doc.fillColor('#222222').fontSize(13).font('Helvetica-Bold').text(title, 45, y);
        y += 22;

        if (t.type === 'Repair' && t.repair?.length) {
          const col = { id: 45, client: 95, tel: 175, brand: 225, model: 290, serial: 360 };
          const colW = { id: 45, client: 75, tel: 45, brand: 60, model: 65, serial: 70 };

          doc.roundedRect(45, y, pw, 18, 3);
          doc.fillColor('#2950ba').fill();
          doc.fillColor('#ffffff').fontSize(7.5).font('Helvetica-Bold');
          doc.text('N°', col.id + 4, y + 4, { width: colW.id });
          doc.text('Client', col.client + 4, y + 4, { width: colW.client });
          doc.text('Tél', col.tel + 4, y + 4, { width: colW.tel });
          doc.text('Marque', col.brand + 4, y + 4, { width: colW.brand });
          doc.text('Modèle', col.model + 4, y + 4, { width: colW.model });
          doc.text('N/S', col.serial + 4, y + 4, { width: colW.serial });
          y += 22;

          let rowIdx = 0;
          t.repair.forEach((r: any) => {
            if (y + 16 > doc.page.height - 50) {
              doc.addPage();
              y = 50;
              rowIdx = 0;
            }
            if (rowIdx % 2 === 1) {
              doc.rect(45, y, pw, 14);
              doc.fillColor('#eaf1ff').fill();
            }
            doc.fillColor('#222222').fontSize(7).font('Helvetica');
            doc.text(String(r.id), col.id + 2, y + 2, { width: colW.id });
            doc.text(r.customerName || '—', col.client + 2, y + 2, { width: colW.client });
            doc.text(r.customerPhone ? String(r.customerPhone) : '—', col.tel + 2, y + 2, { width: colW.tel });
            doc.text(r.brand || '', col.brand + 2, y + 2, { width: colW.brand });
            doc.text(r.model || '', col.model + 2, y + 2, { width: colW.model });
            doc.text(r.serial || '', col.serial + 2, y + 2, { width: colW.serial });
            doc.strokeColor('#d0d8e8').lineWidth(0.3).moveTo(45, y + 14).lineTo(doc.page.width - 45, y + 14).stroke();
            y += 16;
            rowIdx++;
          });
        } else if (t.stockPart?.length) {
          const col = { desc: 45, code: 185, model: 265, serial: 340, bin: 430 };
          const colW = { desc: 135, code: 75, model: 70, serial: 85, bin: 60 };

          doc.roundedRect(45, y, pw, 18, 3);
          doc.fillColor('#2950ba').fill();
          doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
          doc.text('Description', col.desc + 4, y + 4, { width: colW.desc });
          doc.text('Code', col.code + 4, y + 4, { width: colW.code });
          doc.text('Modèle', col.model + 4, y + 4, { width: colW.model });
          doc.text('N° Série', col.serial + 4, y + 4, { width: colW.serial });
          doc.text('Emplacement', col.bin + 4, y + 4, { width: colW.bin });
          y += 22;

          let rowIdx = 0;
          t.stockPart.forEach((sp: any) => {
            if (y + 16 > doc.page.height - 50) {
              doc.addPage();
              y = 50;
              rowIdx = 0;
            }
            if (rowIdx % 2 === 1) {
              doc.rect(45, y, pw, 14);
              doc.fillColor('#eaf1ff').fill();
            }
            doc.fillColor('#222222').fontSize(7.5).font('Helvetica');
            doc.text(sp.partDescription || 'Pièce', col.desc + 2, y + 2, { width: colW.desc });
            doc.text(sp.materialCode || '-', col.code + 2, y + 2, { width: colW.code });
            doc.text(sp.model || '-', col.model + 2, y + 2, { width: colW.model });
            doc.text(sp.serialnumber || '-', col.serial + 2, y + 2, { width: colW.serial });
            doc.text(sp.binName || '-', col.bin + 2, y + 2, { width: colW.bin });
            doc.strokeColor('#d0d8e8').lineWidth(0.3).moveTo(45, y + 14).lineTo(doc.page.width - 45, y + 14).stroke();
            y += 16;
            rowIdx++;
          });
        } else {
          doc.fontSize(9).font('Helvetica-Oblique').fillColor('#888888').text('Aucun élément dans ce transfert', 45, y);
          y += 16;
        }

        // ── Total bar ──
        y += 6;
        const count = t.type === 'Repair' ? t.repair?.length || 0 : t.stockPart?.length || 0;
        const label = t.type === 'Repair' ? 'réparation' : 'pièce';
        doc.roundedRect(45, y, pw, 22, 4);
        doc.fillColor('#2950ba').fill();
        doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold').text(
          `Total : ${count} ${label}${count > 1 ? 's' : ''}`,
          55,
          y + 5,
        );
        y += 40;

        // ── Signature zone ──
        doc.fillColor('#222222').fontSize(9).font('Helvetica');
        doc.lineCap('butt');
        const sigY = doc.page.height - 100;
        doc.strokeColor('#2950ba').lineWidth(1).moveTo(45, sigY).lineTo(250, sigY).stroke();
        doc.text('Cachet / Signature expéditeur', 45, sigY + 5, { width: 205, align: 'center' });
        doc.strokeColor('#2950ba').lineWidth(1).moveTo(doc.page.width - 250, sigY).lineTo(doc.page.width - 45, sigY).stroke();
        doc.text('Cachet / Signature destinataire', doc.page.width - 250, sigY + 5, { width: 205, align: 'center' });

        // ── Footer ──
        const totalPages = doc.bufferedPageRange().count;
        for (let i = 0; i < totalPages; i++) {
          doc.switchToPage(i);
          doc.rect(0, doc.page.height - 30, doc.page.width, 30);
          doc.fillColor('#eef2f7').fill();
          doc.fillColor('#888888').fontSize(7.5).font('Helvetica').text(
            `Page ${i + 1}/${totalPages} — Généré le ${new Date().toLocaleDateString('fr-FR')}`,
            45,
            doc.page.height - 65,
            { align: 'center' },
          );
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
