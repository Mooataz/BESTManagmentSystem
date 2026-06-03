import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repair } from './entities/repair.entity';
import { Accessory } from 'src/accessory/entities/accessory.entity';
import { ListFault } from 'src/list-fault/entities/list-fault.entity';
import { CreateListFaultDto } from 'src/list-fault/dto/create-list-fault.dto';
import { CustomerRequest } from 'src/customer-request/entities/customer-request.entity';
import { NotesCustomer } from 'src/notes-customer/entities/notes-customer.entity';
import { ExpertiseReason } from 'src/expertise-reasons/entities/expertise-reason.entity';
import { RepairAction } from 'src/repair-action/entities/repair-action.entity';
import { AppService } from 'src/app.service';
import { Device } from 'src/devices/entities/device.entity';
import { User } from 'src/users/entities/user.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { ApproveStock } from 'src/approve-stock/entities/approve-stock.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { HistoryRepair } from 'src/history-repair/entities/history-repair.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { PartsPrice } from 'src/parts-price/entities/parts-price.entity';
import { Company } from 'src/company/entities/company.entity';
import { SelectQueryBuilder } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
@Injectable()
export class RepairService {

  constructor(@InjectRepository(Repair) private readonly repairRepositry: Repository<Repair>,
    @InjectRepository(Accessory) private readonly accessoryRepositry: Repository<Accessory>,
    @InjectRepository(ListFault) private readonly listFaultRepositry: Repository<ListFault>,
    @InjectRepository(CustomerRequest) private readonly customerRequestRepositry: Repository<CustomerRequest>,
    @InjectRepository(NotesCustomer) private readonly notesCustomerRepositry: Repository<NotesCustomer>,
    @InjectRepository(ExpertiseReason) private readonly expertiseReasonRepositry: Repository<ExpertiseReason>,
    @InjectRepository(RepairAction) private readonly repairActionRepositry: Repository<RepairAction>,
    @InjectRepository(Device) private readonly deviceRepositry: Repository<Device>,
    @InjectRepository(User) private readonly userRepositry: Repository<User>,
    @InjectRepository(StockPart) private readonly stockPartRepositry: Repository<StockPart>,
    @InjectRepository(ApproveStock) private readonly approveStockRepositry: Repository<ApproveStock>,
    @InjectRepository(Customer) private readonly customerRepositry: Repository<Customer>,
    @InjectRepository(HistoryRepair) private readonly historyRepairRepositry: Repository<HistoryRepair>,
    @InjectRepository(Tracability) private readonly tracabilityRepositry: Repository<Tracability>,
    @InjectRepository(PartsPrice) private readonly partsPriceRepositry: Repository<PartsPrice>,
    @InjectRepository(Company) private readonly companyRepositry: Repository<Company>,

  ) { }
  async create(createRepairDto: CreateRepairDto, userId: number): Promise<Repair> {

    const accessory = await this.accessoryRepositry.find({
      where: { id: In(createRepairDto.accessoryIds ?? []) }
    });
    const listFault = await this.listFaultRepositry.find({
      where: { id: In(createRepairDto.listFaultIds ?? []) }
    });
    const customerRequest = await this.customerRequestRepositry.find({
      where: { id: In(createRepairDto.customerRequestIds ?? []) }
    });

    // Fetch single entities (not arrays)
    const device = await this.deviceRepositry.findOne({
      where: { id: createRepairDto.device }
    });
    const customer = await this.customerRepositry.findOne({
      where: { id: createRepairDto.customer }
    })

    if (!listFault.length) throw new NotFoundException('No Fault found');
    if (!device) throw new NotFoundException('Device not found');


    // Create the repair entity with required fields
    const repairData = {
      actuellybranch: createRepairDto.actuellybranch,
      remark: createRepairDto.remark,
      deviceStateReceive: createRepairDto.deviceStateReceive,
      accessory,
      listFault,
      customerRequest,
      device: { id: createRepairDto.device },
      customer: { id: createRepairDto.customer },

    };


    const newCreate = this.repairRepositry.create(repairData);
    const savedRepair = await this.repairRepositry.save(newCreate);


    // 2. Créer l'historique
    const history = this.historyRepairRepositry.create({
      date: new Date(),
      step: 'Création',
      repair: { id: savedRepair.id },
    });
    const savedHistory = await this.historyRepairRepositry.save(history);

    // 3. Créer la traçabilité
    const tracability = this.tracabilityRepositry.create({
      historyRepair: { id: savedHistory.id },
      user: { id: userId },
    });
    await this.tracabilityRepositry.save(tracability);
    return savedRepair
  }


  async findAll(): Promise<Repair[]> {
    const allfind = await this.repairRepositry.find({
      relations: ['customer', 'customer.distributer',
        'device', 'device.model', 'device.model.brand', 'device.model.allpart', 'device.model.typeModel',
        'accessory',
        'listFault',
        'customerRequest',
        'notesCustomer',
        'expertiseReason',
        'repairAction',
        'user',
        'approveStock',
        'outputList',
        'transfert',
        'invoice',
        'historyRepair', 'historyRepair.tracability', 'historyRepair.tracability.user', 'historyRepair.tracability.user.branch', 'historyRepair.tracability.user.branch.company'], // 👈 ajoute les relations nécessaires ici
    })

    if (!allfind || allfind.length === 0) {
      throw new NotFoundException('There is no data available')
    }
    return allfind;
  }

  async findOne(id: number): Promise<Repair> {
    const onefind = await this.repairRepositry.findOne({
      where: { id },
      relations: ['customer', 'customer.distributer',
        'device', 'device.model', 'device.model.brand', 'device.model.allpart', 'device.model.typeModel',
        'accessory',
        'listFault',
        'customerRequest',
        'notesCustomer',
        'expertiseReason',
        'repairAction',
        'user', 'user.branch',
        'approveStock',
        'outputList',
        'transfert',
        'invoice',
        'historyRepair', 'historyRepair.tracability', 'historyRepair.tracability.user', 'historyRepair.tracability.user.branch', 'historyRepair.tracability.user.branch.company'],
    })
    if (!onefind) {
      throw new NotFoundException('No data available')
    }
    return onefind;
  }




  async remove(id: number): Promise<Repair> {
    const deletedata = await this.repairRepositry.findOne({ where: { id } });
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete')
    }
    await this.repairRepositry.delete({ id: deletedata.id })
    return deletedata;
  }


  async filterRepairByDevice(deviceId: number): Promise<Repair[]> {
    return this.repairRepositry
      .createQueryBuilder('repair')
      .leftJoinAndSelect('repair.device', 'device')
      .where('device.id = :deviceId', { deviceId })
      .getMany();
  }

  async filterRepairByUser(userId: number): Promise<Repair[]> {
    return this.repairRepositry
      .createQueryBuilder('repair')
      .leftJoinAndSelect('repair.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async filterByNewSerialNumber(newSerialNumber: number): Promise<Repair[]> {
    const findAll = await this.repairRepositry
      .createQueryBuilder('repair')
      .where('newSerialNumber = :newSerialNumber', { newSerialNumber })
      .getMany();
    if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no data Available")
    }
    return findAll
  }

  async filterByActuellyBranch(actuellyBranch: number): Promise<Repair[]> {
    const findAll = await this.repairRepositry.find({
      where: {
        actuellybranch: actuellyBranch,

      },
      relations: [
        'customer', 'customer.distributer',
        'device', 'device.model', 'device.model.brand',
        'accessory',
        'listFault',
        'customerRequest',
        'historyRepair',
        'historyRepair.tracability',
        'historyRepair.tracability.user',
        'historyRepair.tracability.user.branch',
        'historyRepair.tracability.user.branch.company'
      ], order: {
        id: 'DESC'
      }
    });

    if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no data Available")
    }
    return findAll
  }

  async findByBranchAndStep(branchId: number, step: string): Promise<Repair[]> {
    const allRepairs = await this.repairRepositry.find({
      where: {
        actuellybranch: branchId
      },
      relations: [
        'customer', 'customer.distributer',
        'device', 'device.model', 'device.model.brand',
        'accessory',
        'listFault',
        'customerRequest',
        'notesCustomer',
        'expertiseReason',
        'repairAction',
        'historyRepair',
        'historyRepair.tracability',
        'historyRepair.tracability.user',
        'historyRepair.tracability.user.branch',
        'historyRepair.tracability.user.branch.company',
        'user'
      ],
      order: {
        historyRepair: {
          date: 'DESC' // pour que le dernier soit en premier
        }
      }
    });

    // Filtrer en mémoire : garder seulement ceux dont le dernier step correspond
    const filtered = allRepairs.filter(repair => {
      const history = repair.historyRepair;
      if (!history || history.length === 0) return false;

      const lastStep = history[0].step; // grâce au tri DESC
      return lastStep === step;
    });

    return filtered;
  }




  async FiltreByUserStep(userId: number, steps: string): Promise<Repair[]> {

    const filtreuserId = await this.repairRepositry.find({
      where: {
        user: { id: userId },


      },
      relations: [
        'customer', 'customer.distributer',
        'device', 'device.model', 'device.model.brand',
        'accessory',
        'listFault',
        'customerRequest',
        'historyRepair',
        'historyRepair.tracability',
        'historyRepair.tracability.user',
        'historyRepair.tracability.user.branch',
        'historyRepair.tracability.user.branch.company',
        'user'
      ],
      order: {
        historyRepair: {
          date: 'DESC' // pour que le dernier soit en premier
        }
      }
    })
    // Filtrer en mémoire : garder seulement ceux dont le dernier step correspond
    const filtered = filtreuserId.filter(repair => {
      const history = repair.historyRepair;
      if (!history || history.length === 0) return false;

      const lastStep = history[0].step; // grâce au tri DESC
      return lastStep === steps;
    });
    return filtered
  }



 async update(id: number, updateRepairDto: UpdateRepairDto): Promise<Repair> {
  // Sécurise dès le début
if (!updateRepairDto || typeof updateRepairDto !== 'object') {
  throw new BadRequestException('Invalid update data');
}

  const existingRepair = await this.repairRepositry.findOne({
    where: { id },
    relations: [
      'device', 'user', 'customer',
      'accessory', 'listFault', 'customerRequest',
      'notesCustomer', 'expertiseReason', 'repairAction'
    ]
  });

  if (!existingRepair) {
    throw new NotFoundException('Repair not found');
  }
if (updateRepairDto.expertiseReason) {
  existingRepair!.expertiseReason =
    await this.expertiseReasonRepositry.findBy({
      id: In(updateRepairDto.expertiseReason),
    });
}
  // Parse helper
  const parseIfString = <T>(value: any): T =>
    typeof value === 'string' ? JSON.parse(value) : value;
if (updateRepairDto.repairAction) {
  existingRepair!.repairAction =
    await this.repairActionRepositry.findBy({
      id: In(updateRepairDto.repairAction),
    });
}

if (updateRepairDto.notesCustomer) {
  existingRepair!.notesCustomer =
    await this.notesCustomerRepositry.findBy({
      id: In(updateRepairDto.notesCustomer),
    });
}

if (updateRepairDto.partsNeed) {
  existingRepair!.partsNeed = updateRepairDto.partsNeed;
}
  // Parse tous les champs ID-array s'ils arrivent en string
  updateRepairDto.accessoryIds = parseIfString(updateRepairDto?.accessoryIds);
  updateRepairDto.listFaultIds = parseIfString(updateRepairDto?.listFaultIds);
  updateRepairDto.customerRequestIds = parseIfString(updateRepairDto?.customerRequestIds);
  updateRepairDto.notesCustomer = parseIfString(updateRepairDto?.notesCustomer);
  updateRepairDto.expertiseReason = parseIfString(updateRepairDto?.expertiseReason);
  updateRepairDto.repairAction = parseIfString(updateRepairDto?.repairAction);
  updateRepairDto.partsNeed = parseIfString(updateRepairDto?.partsNeed);
  updateRepairDto.device = parseIfString(updateRepairDto?.device);
  updateRepairDto.user = parseIfString(updateRepairDto?.user);
  updateRepairDto.customer = parseIfString(updateRepairDto?.customer);

  // Relations ManyToOne
  if (updateRepairDto.device !== undefined) {
    existingRepair.device = await this.deviceRepositry.findOneByOrFail({ id: updateRepairDto.device });
  }
  if (updateRepairDto.user !== undefined) {
    existingRepair.user = await this.userRepositry.findOneByOrFail({ id: updateRepairDto.user });
  }
  if (updateRepairDto.customer !== undefined) {
    existingRepair.customer = await this.customerRepositry.findOneByOrFail({ id: updateRepairDto.customer });
  }

  // Relations ManyToMany
  if (updateRepairDto.accessoryIds) {
    existingRepair.accessory = await this.accessoryRepositry.findBy({ id: In(updateRepairDto.accessoryIds) });
  }
  if (updateRepairDto.listFaultIds) {
    existingRepair.listFault = await this.listFaultRepositry.findBy({ id: In(updateRepairDto.listFaultIds) });
  }
  if (updateRepairDto.customerRequestIds) {
    existingRepair.customerRequest = await this.customerRequestRepositry.findBy({ id: In(updateRepairDto.customerRequestIds) });
  }
  if (updateRepairDto.notesCustomer) {
    existingRepair.notesCustomer = await this.notesCustomerRepositry.findBy({ id: In(updateRepairDto.notesCustomer) });
  }
  if (updateRepairDto.expertiseReason) {
    existingRepair.expertiseReason = await this.expertiseReasonRepositry.findBy({ id: In(updateRepairDto.expertiseReason) });
  }
  if (updateRepairDto.repairAction) {
    existingRepair.repairAction = await this.repairActionRepositry.findBy({ id: In(updateRepairDto.repairAction) });
  }

  // Champs simples
  const simpleFields: (keyof UpdateRepairDto)[] = [
    'warrenty', 'approveRepair', 'newSerialNumber', 'remark',
    'deviceStateReceive', 'files', 'partsNeed', 'actuellybranch'
  ];

  for (const field of simpleFields) {
    if (updateRepairDto[field] !== undefined) {
      (existingRepair as any)[field] = updateRepairDto[field];
    }
  }

  await this.repairRepositry.save(existingRepair);

  // ✅ Sync ApproveStock — create entries for any selected parts
  const finalPartIds = (Array.isArray(existingRepair.partsNeed) ? existingRepair.partsNeed : []).map(Number);

  const existingEntries = await this.approveStockRepositry.find({
    where: { repair: { id } },
  });

  const existingPartIds = existingEntries.map(e => Number(e.idPartRepair));

  // Delete entries for parts no longer in partsNeed
  const toDelete = existingEntries.filter(e => !finalPartIds.includes(Number(e.idPartRepair)));
  if (toDelete.length > 0) {
    await this.approveStockRepositry.remove(toDelete);
  }

  // Create entries for new parts
  const toCreate = finalPartIds.filter(id => !existingPartIds.includes(id));
  if (toCreate.length > 0) {
    const entries = toCreate.map(partId => ({
      type: existingRepair.repairAction?.some(a => a.name === 'Nouvelle appareille') ? 'Nouvelle appareille' : 'Réparation',
      date: new Date(),
      state: 'En cours',
      idPartRepair: partId,
      repair: { id },
    }));
    await this.approveStockRepositry.save(entries);
  }

  return this.repairRepositry.findOneOrFail({
    where: { id },
    relations: [
      'customer', 'customer.distributer',
      'device', 'device.model', 'device.model.brand', 'device.model.allpart', 'device.model.typeModel',
      'accessory',
      'listFault',
      'customerRequest',
      'notesCustomer',
      'expertiseReason',
      'repairAction',
      'approveStock',
      'user',
    ],
  });
}




  async removeFile(id: number, fileName: string): Promise<Repair> {
    const repair = await this.repairRepositry.findOne({ where: { id } });
    if (!repair) throw new NotFoundException('Repair not found');

    const files = (repair.files ?? []) as string[];
    if (!files.includes(fileName)) {
      throw new NotFoundException(`File ${fileName} not found in repair ${id}`);
    }

    const filePath = path.join(process.cwd(), 'upload/repairs', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    repair.files = files.filter(f => f !== fileName);
    return await this.repairRepositry.save(repair);
  }

  async generatePdf(id: number, res: any): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const repair = await this.findOne(id);
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument({ margin: 40, bufferPages: true, size: 'A4' });
        doc.pipe(res);
        doc.on('finish', () => resolve());
        doc.on('error', (err: any) => reject(err));

        const pw = doc.page.width - 80;
        const actionName = (repair.repairAction?.[0]?.name ?? '').trim();
        const isDevis = actionName === 'Devis';
        const isReparation = actionName === 'Réparation';
        const allParts = repair.device?.model?.allpart ?? [];

        // ── Company info ──
        const company = await this.companyRepositry.findOne({ where: {} });
        const lastRecup = [...(repair.historyRepair ?? [])]
          .filter(h => h.date && (h.step === 'Récupérer' || h.step === 'Récupération'))
          .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())[0];

        // ── Header ──
        const logoPath = company?.logo ? path.join(process.cwd(), 'upload', 'company', company.logo) : null;
        const logoW = 56;
        let leftX = 40;
        if (logoPath && fs.existsSync(logoPath)) {
          try { doc.image(logoPath, 40, 6, { width: logoW }); } catch { /* skip */ }
          leftX = 40 + logoW + 6;
        }
        doc.fillColor('#2950ba').fontSize(13).font('Helvetica-Bold').text(company?.name ?? 'BEST Management', leftX, 9, { width: 300 });
        doc.fillColor('#555555').fontSize(7).font('Helvetica').text(
          company?.headquarterslocation ? company.headquarterslocation : '', leftX, 27, { width: 300 }
        );
        doc.fillColor('#2950ba').fontSize(9).font('Helvetica-Bold').text(`FICHE RÉPARATION #${repair.id}`, 0, 12, { width: doc.page.width - 40, align: 'right' });
        const creationDate = repair.historyRepair?.length ? new Date(repair.historyRepair[0].date ?? new Date()) : new Date();
        doc.fillColor('#555555').fontSize(7).font('Helvetica').text(`Créée le ${creationDate.toLocaleDateString('fr-FR')}`, 0, 26, { width: doc.page.width - 40, align: 'right' });

        let y = 65;

        // ── Helpers ──
        const box = (bx: number, by: number, bw: number, bh: number, title: string, draw: (cx: number, cy: number, cw: number) => void) => {
          doc.roundedRect(bx, by, bw, bh, 3);
          doc.fillColor('#f9fafc').fill();
          doc.strokeColor('#2950ba').lineWidth(0.5).stroke();
          doc.fillColor('#2950ba').fontSize(7).font('Helvetica-Bold').text(title, bx + 3, by + 3);
          draw(bx + 3, by + 14, bw - 6);
        };
        const bf = (label: string, value: string, cx: number, cy: number, cw: number, row: number) => {
          const fy = cy + row * 15;
          doc.fillColor('#666666').fontSize(5.5).font('Helvetica-Bold').text(label, cx, fy);
          doc.fillColor('#222222').fontSize(7).font('Helvetica').text(value || '-', cx, fy + 7, { width: cw });
        };
        const chipText = (items: { id: number; name?: string; description?: string }[], cx: number, cy: number, cw: number) => {
          if (items.length > 0) {
            const labels = items.slice(0, 4).map(i => i.name ?? i.description ?? `#${i.id}`).join(', ');
            doc.fillColor('#222222').fontSize(6.5).font('Helvetica').text(labels, cx, cy, { width: cw, height: 18 });
          } else {
            doc.fillColor('#888888').fontSize(6).font('Helvetica-Oblique').text('Aucun', cx, cy);
          }
        };

        const colW = (pw - 20) / 3;
        const cgap = 10;
        const cx = [40, 40 + colW + cgap, 40 + 2 * (colW + cgap)];

        const r1h = 90;
        const r2h = 36;
        const r3h = 36;

        const newPageIfNeeded = (needed: number) => { if (y + needed > doc.page.height - 40) { doc.addPage(); y = 40; } };

        // ── Row 1: Appareil | Infos | Client ──
        newPageIfNeeded(r1h);
        box(cx[0], y, colW, r1h, 'APPAREIL', (bx, by, bw) => {
          bf('N° Série', repair.device?.serialenumber ?? '—', bx, by, bw, 0);
          bf('Marque', repair.device?.model?.brand?.name ?? '—', bx, by, bw, 1);
          bf('Modèle', repair.device?.model?.name ?? '—', bx, by, bw, 2);
          bf('Type', repair.device?.model?.typeModel?.description ?? '—', bx, by, bw, 3);
        });
        box(cx[1], y, colW, r1h, 'RÉPARATION', (bx, by, bw) => {
          const w2 = (bw - 4) / 2;
          bf('Garantie', repair.warrenty ? 'Oui' : 'Non', bx, by, w2, 0);
          bf('Approuvé', repair.approveRepair ? 'Oui' : 'Non', bx + w2 + 2, by, w2, 0);
          bf('Nouveau NS', repair.newserialnumber ?? '—', bx, by, bw, 1);
          bf('État reçu', repair.deviceStateReceive || '—', bx, by, bw, 2);
          if (repair.remark) bf('Remarque', repair.remark, bx, by, bw, 3);
          const dateStr = lastRecup ? new Date(lastRecup.date!).toLocaleDateString('fr-FR') : '—';
          bf('Date récupération', dateStr, bx, by, bw, 4);
        });
        box(cx[2], y, colW, r1h, 'CLIENT', (bx, by, bw) => {
          bf('Nom', repair.customer?.name ?? '—', bx, by, bw, 0);
          bf('Téléphone', repair.customer?.phone != null ? String(repair.customer.phone) : '—', bx, by, bw, 1);
          bf('Distributeur', repair.customer?.distributer?.name ?? '—', bx, by, bw, 2);
          bf('Technicien', repair.user?.name ?? '—', bx, by, bw, 3);
        });
        y += r1h + 6;

        // ── Row 2: Accessoires | Pannes | Demandes ──
        newPageIfNeeded(r2h);
        box(cx[0], y, colW, r2h, 'ACCESSOIRES', (bx, by, bw) => chipText(repair.accessory ?? [], bx, by, bw));
        box(cx[1], y, colW, r2h, 'PANNES CONSTATÉES', (bx, by, bw) => chipText(repair.listFault ?? [], bx, by, bw));
        box(cx[2], y, colW, r2h, 'DEMANDES CLIENT', (bx, by, bw) => chipText(repair.customerRequest ?? [], bx, by, bw));
        y += r2h + 6;

        // ── Row 3: Notes | Expertise | Actions ──
        newPageIfNeeded(r3h);
        box(cx[0], y, colW, r3h, 'NOTES CLIENT', (bx, by, bw) => chipText(repair.notesCustomer ?? [], bx, by, bw));
        box(cx[1], y, colW, r3h, 'RAISONS EXPERTISE', (bx, by, bw) => chipText(repair.expertiseReason ?? [], bx, by, bw));
        box(cx[2], y, colW, r3h, 'ACTIONS', (bx, by, bw) => chipText(repair.repairAction ?? [], bx, by, bw));
        y += r3h + 6;

        const sectionTitle = (title: string) => {
          newPageIfNeeded(16);
          doc.fillColor('#2950ba').fontSize(9).font('Helvetica-Bold').text(title, 40, y);
          y += 13;
        };

        // ── Pièces : Devis ──
        if (isDevis) {
          const modelId = repair.device?.model?.id;
          const partIds = repair.partsNeed ?? [];
          let devisParts: { description: string; price: number; levelPrice: number }[] = [];
          let tva = 0;
          let timbre = 0;

          if (partIds.length > 0) {
            let priceMap = new Map<number, { price: number; levelPrice: number }>();
            if (modelId) {
              const prices = await this.partsPriceRepositry.find({
                where: { model: { id: modelId }, allPart: { id: In(partIds) } },
                relations: ['allPart', 'levelRepair'],
              });
              for (const p of prices) {
                priceMap.set(Number(p.allPart?.id), { price: p.price ?? 0, levelPrice: p.levelRepair?.price ?? 0 });
              }
            }
            for (const pid of partIds) {
              const p = allParts.find(a => Number(a.id) === Number(pid));
              const pp = priceMap.get(Number(pid));
              devisParts.push({
                description: p?.description ?? `Pièce #${pid}`,
                price: pp?.price ?? 0,
                levelPrice: pp?.levelPrice ?? 0,
              });
            }
            const company = await this.companyRepositry.findOne({ where: {} });
            tva = company?.tva ?? 0;
            timbre = company?.timbreFiscale ?? 0;
          }

          if (devisParts.length > 0) {
            if (y + 30 > doc.page.height - 70) { doc.addPage(); y = 40; }
            sectionTitle('DEVIS');
            const col = { desc: 40, price: 240, level: 340 };
            const headY = y;
            doc.roundedRect(40, y, pw, 14, 3);
            doc.fillColor('#2950ba').fill();
            doc.fillColor('#ffffff').fontSize(7).font('Helvetica-Bold');
            doc.text('Pièce', col.desc + 3, y + 2, { width: 190 });
            doc.text('Prix (DT)', col.price + 3, y + 2, { width: 80 });
            doc.text('Main-d\'œuvre', col.level + 3, y + 2, { width: 100 });
            y += 16;

            const sumParts = devisParts.reduce((s, p) => s + p.price, 0);
            const highestLevel = Math.max(...devisParts.map(p => p.levelPrice), 0);

            devisParts.forEach((p, i) => {
              if (y + 12 > doc.page.height - 60) { doc.addPage(); y = 50; }
              if (i % 2 === 1) { doc.rect(40, y, pw, 12); doc.fillColor('#f0f4ff').fill(); }
              doc.fillColor('#222222').fontSize(7).font('Helvetica');
              doc.text(p.description, col.desc + 2, y + 1, { width: 190 });
              doc.text(p.price.toFixed(3), col.price + 2, y + 1, { width: 80 });
              doc.text(p.levelPrice.toFixed(3), col.level + 2, y + 1, { width: 100 });
              doc.strokeColor('#d0d8e8').lineWidth(0.3).moveTo(40, y + 12).lineTo(40 + pw, y + 12).stroke();
              y += 13;
            });

            const subtotal = sumParts + highestLevel;
            const tvaAmount = subtotal * (tva / 100);
            const total = subtotal + tvaAmount + timbre;

            y += 3;
            doc.roundedRect(40, y, pw, 14, 3);
            doc.fillColor('#f9fafc').fill();
            doc.strokeColor('#2950ba').lineWidth(0.5).stroke();
            y += 2;
            const totW = 80;
            const totX = pw - 110;
            doc.fillColor('#222222').fontSize(7.5).font('Helvetica');
            doc.text(`Total pièces`, 42, y, { width: 120 });
            doc.text(`${sumParts.toFixed(3)} DT`, totX, y, { width: totW, align: 'right' });
            y += 10;
            doc.text(`Main-d'œuvre (niv. max)`, 42, y, { width: 180 });
            doc.text(`${highestLevel.toFixed(3)} DT`, totX, y, { width: totW, align: 'right' });
            y += 10;
            doc.text(`TVA ${tva}%`, 42, y, { width: 120 });
            doc.text(`${tvaAmount.toFixed(3)} DT`, totX, y, { width: totW, align: 'right' });
            y += 10;
            doc.text(`Timbre fiscal`, 42, y, { width: 120 });
            doc.text(`${timbre.toFixed(3)} DT`, totX, y, { width: totW, align: 'right' });
            y += 12;
            const nombreEnLettres = (n: number): string => {
              if (n === 0) return 'zéro';
              const u = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
              const d = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];
              const f = (m: number): string => {
                if (m <= 16) return u[m];
                if (m <= 19) return `dix-${u[m - 10]}`;
                if (m <= 69) {
                  const t = Math.floor(m / 10), r = m % 10;
                  if (r === 0) return d[t];
                  if (r === 1) return `${d[t]} et un`;
                  return `${d[t]}-${u[r]}`;
                }
                if (m <= 79) {
                  const r = m - 60;
                  if (r === 11) return 'soixante et onze';
                  return `soixante-${f(r)}`;
                }
                if (m <= 89) {
                  const r = m - 80;
                  if (r === 0) return 'quatre-vingts';
                  if (r === 1) return 'quatre-vingt-un';
                  return `quatre-vingt-${u[r]}`;
                }
                return `quatre-vingt-${f(m - 80)}`;
              };
              const ch = (v: number): string => {
                if (v === 0) return '';
                const h = Math.floor(v / 100), r = v % 100;
                const hs = h === 1 ? 'cent' : h > 1 ? `${u[h]} cent${r === 0 && h > 1 ? 's' : ''}` : '';
                const rs = r > 0 ? f(r) : '';
                return hs && rs ? `${hs} ${rs}` : hs || rs;
              };
              const intPart = Math.floor(n);
              const mi = Math.floor(intPart / 1000000);
              const th = Math.floor((intPart % 1000000) / 1000);
              const rem = intPart % 1000;
              const parts: string[] = [];
              if (mi > 0) parts.push(`${ch(mi)} million${mi > 1 ? 's' : ''}`);
              if (th > 0) parts.push(`${ch(th)} mille`);
              if (rem > 0 || parts.length === 0) parts.push(ch(rem));
              return parts.join(' ').replace(/\s+/g, ' ').trim();
            };
            doc.fillColor('#2950ba').fontSize(7).font('Helvetica-Oblique').text(
              `Arrêté le présent devis à la somme de : ${nombreEnLettres(Math.floor(total))} dinars${total % 1 > 0.001 ? ' et ' + Math.round((total % 1) * 1000) + ' millimes' : ''}`,
              42, y, { width: pw - 8, align: 'center' }
            );
            y += 11;
            doc.rect(42, y - 1, pw - 4, 16).fillColor('#2950ba').fill();
            doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
            doc.text('Total TTC', 42, y + 1, { width: 120 });
            doc.text(`${total.toFixed(3)} DT`, totX, y + 1, { width: totW, align: 'right' });
            y += 20;
          } else {
            if (y + 30 > doc.page.height - 70) { doc.addPage(); y = 40; }
            sectionTitle('PIÈCES PROPOSÉES (DEVIS)');
            doc.fillColor('#888888').fontSize(8).font('Helvetica-Oblique').text('Aucune pièce sélectionnée', 40, y);
            y += 14;
          }
        }

        // ── Pièces : Réparation ──
        if (isReparation && repair.approveStock?.length) {
          if (y + 30 > doc.page.height - 70) { doc.addPage(); y = 40; }
          sectionTitle('PIÈCES CHANGÉES');
          const confirmed = repair.approveStock.filter(a => a.state === 'Confirmer');
          if (confirmed.length > 0) {
            const labels = confirmed.map(a => {
              const part = allParts.find(p => Number(p.id) === Number(a.idPartRepair));
              return part?.description ?? `Pièce #${a.idPartRepair}`;
            }).join(', ');
            doc.fillColor('#009650').fontSize(8.5).font('Helvetica').text(labels, 40, y, { width: pw });
            y += 14 * Math.max(1, Math.ceil(doc.widthOfString(labels) / pw));
          }
        }

        // ── Images ──
        if (Array.isArray(repair.files) && repair.files.length > 0) {
          if (y + 30 > doc.page.height - 70) { doc.addPage(); y = 40; }
          sectionTitle('FICHIERS');
          const imgExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
          const imgDir = path.join(process.cwd(), 'upload/repairs');
          const images = repair.files.filter(f => imgExts.includes(path.extname(f).toLowerCase()));
          if (images.length === 0) {
            doc.fillColor('#888888').fontSize(8).font('Helvetica-Oblique').text('Aucune image', 40, y);
            y += 14;
          } else {
            const imgGap = 8;
            const imgW = (pw - imgGap) / 2;
            const imgH = imgW * 0.55;
            const rowH = imgH + 3;
            for (let i = 0; i < images.length; i++) {
              const filePath = path.join(imgDir, images[i]);
              if (!fs.existsSync(filePath)) continue;
              if (y + rowH > doc.page.height - 40) { doc.addPage(); y = 40; }
              try {
                const col = i % 2;
                const xPos = 40 + col * (imgW + imgGap);
                doc.rect(xPos - 1, y - 1, imgW + 2, imgH + 2).fillColor('#eef2f7').fill();
                doc.image(filePath, xPos, y, { fit: [imgW, imgH], align: 'center', valign: 'center' });
                if (col === 1) y += rowH;
              } catch { /* skip unreadable */ }
            }
            if (images.length % 2 !== 0) y += imgH + 3;
          }
        }

        // ── Footer ──
        const totalPages = doc.bufferedPageRange().count;
        const branch = (repair.user as any)?.branch;
        for (let i = 0; i < totalPages; i++) {
          doc.switchToPage(i);
          const fh = doc.page.height;
          const fh2 = fh - 120;
          doc.rect(0, fh2, doc.page.width, 120);
          doc.fillColor('#eef2f7').fill();
          doc.fillColor('#2950ba').fontSize(7).font('Helvetica-Bold').text('SOCIÉTÉ', 40, fh2 + 4);
          doc.fillColor('#2950ba').fontSize(7).font('Helvetica-Bold').text('AGENCE', doc.page.width / 2 + 10, fh2 + 4);
          doc.fillColor('#222222').fontSize(6.5).font('Helvetica');
          const ci = [
            `Raison sociale : ${company?.name ?? '—'}`,
            `Siège : ${company?.headquarterslocation ?? '—'}`,
            `Matricule fiscal : ${company?.taxRegisterNumber ?? '—'}`,
            `RIB : ${company?.rib != null ? String(company.rib) : '—'}`,
            `Banque : ${company?.bank ?? '—'}`,
          ];
          ci.forEach((line, idx) => doc.text(line, 40, fh2 + 16 + idx * 10, { width: doc.page.width / 2 - 50 }));
          const bi = [
            `Agence : ${branch?.name ?? '—'}`,
            `Adresse : ${branch?.location ?? '—'}`,
            `Tél : ${branch?.phone != null ? String(branch.phone) : '—'}`,
            `Email : ${branch?.email ?? '—'}`,
          ];
          bi.forEach((line, idx) => doc.text(line, doc.page.width / 2 + 10, fh2 + 16 + idx * 10, { width: doc.page.width / 2 - 50 }));
          doc.fillColor('#888888').fontSize(7.5).font('Helvetica').text(
            `Page ${i + 1}/${totalPages} — Généré le ${new Date().toLocaleDateString('fr-FR')}`,
            0,
            fh - 65,
            { width: doc.page.width - 40, align: 'center' },
          );
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  async updateRepairWithParts(
  id: number,
  updateRepairDto: UpdateRepairDto,
  files?: string[],
): Promise<Repair> {
  const repair = await this.repairRepositry.findOne({ where: { id } });

  if (!repair) {
    throw new NotFoundException(`Repair with id ${id} not found`);
  }

  // ✅ Gestion fichiers (optionnelle)
  if (files && files.length > 0) {
    // Supprimer anciens fichiers
    if (Array.isArray(repair.files)) {
      for (const oldFile of repair.files) {
        const filePath = path.join(
          process.cwd(),
          'upload/repairs',
          oldFile,
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }
    repair.files = files;
  }

  // ✅ MAJ PARTIELLE : ignorer undefined
  Object.entries(updateRepairDto || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      (repair as any)[key] = value;
    }
  });

  await this.repairRepositry.save(repair);

  return this.repairRepositry.findOneOrFail({
    where: { id },
    relations: [
      'customer', 'customer.distributer',
      'device', 'device.model', 'device.model.brand', 'device.model.allpart', 'device.model.typeModel',
      'accessory',
      'listFault',
      'customerRequest',
      'notesCustomer',
      'expertiseReason',
      'repairAction',
      'user',
    ],
  });
}

async getStats(dateFrom?: string, dateTo?: string) {
  const byWeekRaw: any[] = await this.repairRepositry.query(`
    SELECT
      date_trunc('week', hr.date) AS "weekStart",
      COUNT(r.id)::int AS "total"
    FROM repair r
    LEFT JOIN history_repair hr ON hr."repairId" = r.id AND hr.step = $1
    GROUP BY date_trunc('week', hr.date)
    ORDER BY "weekStart" ASC
  `, ['Création']);

  const byBranchRaw: any[] = await this.repairRepositry.query(`
    SELECT
      r.actuellybranch AS "branchId",
      COALESCE(b.name, 'Sans agence') AS "branchName",
      COUNT(r.id)::int AS "total",
      COALESCE(SUM(CASE WHEN r.warrenty = true THEN 1 ELSE 0 END), 0)::int AS "sousGarantie",
      COALESCE(SUM(CASE WHEN r.warrenty IS NULL OR r.warrenty = false THEN 1 ELSE 0 END), 0)::int AS "horsGarantie"
    FROM repair r
    LEFT JOIN branch b ON b.id = r.actuellybranch
    LEFT JOIN history_repair hr ON hr."repairId" = r.id AND hr.step = $3
    WHERE ($1::timestamptz IS NULL OR hr.date >= $1::timestamptz)
      AND ($2::timestamptz IS NULL OR hr.date < $2::timestamptz + interval '1 day')
    GROUP BY r.actuellybranch, b.name
    ORDER BY "total" DESC
  `, [dateFrom ?? null, dateTo ?? null, 'Création']);

  const byTechnicianRaw: any[] = await this.repairRepositry.query(`
    SELECT
      u.id AS "userId",
      u.name AS "userName",
      r.actuellybranch AS "branchId",
      COALESCE(b.name, 'Sans agence') AS "branchName",
      COUNT(r.id)::int AS "total",
      COALESCE(SUM(CASE WHEN r.warrenty = true THEN 1 ELSE 0 END), 0)::int AS "sousGarantie",
      COALESCE(SUM(CASE WHEN r.warrenty IS NULL OR r.warrenty = false THEN 1 ELSE 0 END), 0)::int AS "horsGarantie"
    FROM repair r
    LEFT JOIN "user" u ON u.id = r."userId"
    LEFT JOIN branch b ON b.id = r.actuellybranch
    LEFT JOIN history_repair hr ON hr."repairId" = r.id AND hr.step = $3
    WHERE u.role LIKE '%Technicien%'
      AND ($1::timestamptz IS NULL OR hr.date >= $1::timestamptz)
      AND ($2::timestamptz IS NULL OR hr.date < $2::timestamptz + interval '1 day')
    GROUP BY u.id, u.name, r.actuellybranch, b.name
    ORDER BY b.name, "total" DESC
  `, [dateFrom ?? null, dateTo ?? null, 'Création']);

  const byTechnicianByBranch: { branchId: number; branchName: string; technicians: typeof byTechnicianRaw }[] = [];
  for (const row of byTechnicianRaw) {
    let group = byTechnicianByBranch.find(g => g.branchId === row.branchId);
    if (!group) {
      group = { branchId: row.branchId, branchName: row.branchName, technicians: [] };
      byTechnicianByBranch.push(group);
    }
    group.technicians.push(row);
  }

  return { byWeek: byWeekRaw, byBranch: byBranchRaw, byTechnicianByBranch };
}





}
