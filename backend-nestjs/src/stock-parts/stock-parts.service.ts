import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateStockPartDto } from './dto/create-stock-part.dto';
import { UpdateStockPartDto } from './dto/update-stock-part.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StockPart } from './entities/stock-part.entity';
import { In, Repository } from 'typeorm';
import { AppService } from 'src/app.service';
import { Bin } from 'src/bin/entities/bin.entity';
import { AppModule } from 'src/app.module';
import { ModelsService } from 'src/models/models.service';
import { ReferencesService } from 'src/references/references.service';
import { Reference } from 'src/references/entities/reference.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Cron } from '@nestjs/schedule';
import cluster, * as Cluster from 'cluster';
import * as Lockfile from 'lockfile';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { plainToInstance } from 'class-transformer';
import { Company } from 'src/company/entities/company.entity';
import { HistoryStockPart } from 'src/history-stock-part/entities/history-stock-part.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { PdfService } from 'src/pdf/pdf.service';
import { Legislation } from 'src/legislation/entities/legislation.entity';
import { StockGateway } from './Stock.Gateway';
import { User } from 'src/users/entities/user.entity';



@Injectable({ scope: Scope.DEFAULT })
export class StockPartsService {
  private readonly LOCK_FILE = path.join(os.tmpdir(), 'stock-calculation.lock');
  private isRunning = false; // Verrou en mémoire pour single-instance
  constructor(@InjectRepository(StockPart) private readonly stockPartRepositry: Repository<StockPart>,
    @InjectRepository(Branch) private readonly branchRepositry: Repository<Branch>,
    @InjectRepository(Bin) private readonly binRepositry: Repository<Bin>,
    @InjectRepository(Company) private readonly companyRepositry: Repository<Company>,
    @InjectRepository(HistoryStockPart) private readonly historyStockPartRepositry: Repository<HistoryStockPart>,
    @InjectRepository(Tracability) private readonly tracabilityRepositry: Repository<Tracability>,
    @InjectRepository(User) private readonly UserRepositry: Repository<User>,
    private appService: AppService,
    private modelService: ModelsService,
    private referenceService: ReferencesService,
    private PDFService: PdfService,
    private StockGateway: StockGateway,) { }

  async create(createStockPartDto: CreateStockPartDto, userId: number): Promise<StockPart> {
    if (createStockPartDto.serialNumber) {
      createStockPartDto.serialNumber = this.appService.cleanSpaces(createStockPartDto.serialNumber);
    }
    const { userId: _uid, bin: binId, reference: refId, ...rest } = createStockPartDto;
    const newCreate = this.stockPartRepositry.create({
      ...rest,
      bin: binId ? { id: binId } : undefined,
      reference: refId ? { id: refId } : undefined,
    });
    const saveStockPart = await this.stockPartRepositry.save(newCreate);

    const history = this.historyStockPartRepositry.create({
      date: new Date(),
      step: 'Création',
      stockPart: { id: saveStockPart.id },
    });

    const savedHistory = await this.historyStockPartRepositry.save(history);


    const tracability = this.tracabilityRepositry.create({
      historyStockPart: { id: savedHistory.id },
      user: { id: userId },
    });
    await this.tracabilityRepositry.save(tracability);
    return saveStockPart
  }

  async findAll(): Promise<StockPart[]> {
    return this.stockPartRepositry.find({
      relations: [
        'bin',
        'reference', 'reference.model', 'reference.model.brand', 'reference.allpart',
        'historyStockPart', 'historyStockPart.tracability', 'historyStockPart.tracability.user'
      ]
    });
  }

  async findOne(id: number): Promise<StockPart> {
    const findOne = await this.stockPartRepositry.findOne({
      where: { id },
      relations: [
        'bin',
        'reference', 'reference.model', 'reference.model.brand', 'reference.allpart',
        'historyStockPart', 'historyStockPart.tracability', 'historyStockPart.tracability.user'
      ]
    })
    if (!findOne) {
      throw new NotFoundException('No data available')
    }
    return findOne;
  }

  async update(id: number, updateStockPartDto: UpdateStockPartDto): Promise<StockPart> {
    const { bin: binId, reference: refId, ...rest } = updateStockPartDto as any;
    const updateData: any = { ...rest };
    if (binId) updateData.bin = { id: Number(binId) };
    if (refId) updateData.reference = { id: Number(refId) };
    await this.stockPartRepositry.update(id, updateData);
    const updated = await this.stockPartRepositry.findOne({ where: { id } })
    if (!updated) {
      throw new NotFoundException('data not found to update')
    }
    return updated;
  }

  async remove(id: number): Promise<StockPart> {
    const deletedata = await this.stockPartRepositry.findOne({ where: { id } });
    if (!deletedata) {
      throw new NotFoundException('data not found for delete')
    }
    await this.stockPartRepositry.delete({ id: deletedata.id })
    return deletedata;
  }


  async filterByReferenceAndBin(referencesIds: number[], binId: number): Promise<StockPart[]> {
    return this.stockPartRepositry
      .createQueryBuilder('stockPart')
      .leftJoinAndSelect('stockPart.reference', 'reference')
      .leftJoinAndSelect('stockPart.bin', 'bin')
      .where('bin.id = :binId', { binId })
      .andWhere('reference.id IN (:...referencesIds)', { referencesIds })
      .getMany();
  }

  async findByBranchId(branchId: number): Promise<StockPart[]> {
    return this.stockPartRepositry
      .createQueryBuilder('stockPart')
      .leftJoinAndSelect('stockPart.bin', 'bin')
      .leftJoinAndSelect('bin.branch', 'branch')
      .leftJoinAndSelect('stockPart.reference', 'reference')
      .leftJoinAndSelect('reference.model', 'model')
      .leftJoinAndSelect('model.brand', 'brand')
      .leftJoinAndSelect('reference.allpart', 'allpart')
      .leftJoinAndSelect('stockPart.historyStockPart', 'historyStockPart')
      .leftJoinAndSelect('historyStockPart.tracability', 'tracability')
      .leftJoinAndSelect('tracability.user', 'user')
      .where('branch.id = :branchId', { branchId })
      .orderBy('stockPart.id', 'DESC')  // ← Ajout du tri ici
      .getMany();
  }

  async findByBinType(type: string, branchId: number): Promise<StockPart[]> {
    return this.stockPartRepositry
      .createQueryBuilder('StockPart')
      .leftJoinAndSelect('StockPart.bin', 'bin')
      .leftJoinAndSelect('bin.branch', 'branch')
      .leftJoinAndSelect('StockPart.reference', 'reference')
      .leftJoinAndSelect('reference.allpart', 'allpart')
      .leftJoinAndSelect('reference.model', 'model')
      .where('bin.type = :type', { type })
      .andWhere('branch.id = :branchId', { branchId })
      .getMany();
  }
  async findGoodReference(references: Reference[], branchId: number): Promise<StockPart[]> {
    const refIds = references.map(ref => ref.id); // EXTRACTION des ids
    const goodPart = await this.stockPartRepositry
      .createQueryBuilder('stockPart')
      .leftJoinAndSelect('stockPart.reference', 'ref')
      .leftJoinAndSelect('stockPart.bin', 'bin')
      .leftJoinAndSelect('bin.branch', 'branch')
      .where('bin.type = :type', { type: 'Good' })
      .andWhere('branch.id = :branchId', { branchId })
      .andWhere('ref.id IN (:...refIds)', { refIds })
      .getMany();
    return goodPart;
  }

  async AddHistoryStockPart(id: number, userId: number, step: string): Promise<number> {
    const history = this.historyStockPartRepositry.create({
      date: new Date(),
      step: step,
      stockPart: { id: id },
    });

    const savedHistory = await this.historyStockPartRepositry.save(history);


    const tracability = this.tracabilityRepositry.create({
      historyStockPart: { id: savedHistory.id },
      user: { id: userId },
    });
    await this.tracabilityRepositry.save(tracability);
    return id
  }

  async findMultipleByIds(ids: number[]): Promise<StockPart[]> {
    return this.stockPartRepositry.find({
      where: { id: In(ids) },
      relations: [
        'bin', 'bin.branch',
        'reference', 'reference.model', 'reference.model.brand',
        'reference.model.typeModel', 'reference.allpart',
      ],
    });
  }

  async findAppareilComplet(modelId: number, branchId: number): Promise<StockPart[]> {
    return this.stockPartRepositry
      .createQueryBuilder('stockPart')
      .leftJoinAndSelect('stockPart.bin', 'bin')
      .leftJoinAndSelect('bin.branch', 'branch')
      .leftJoinAndSelect('stockPart.reference', 'reference')
      .leftJoinAndSelect('reference.allpart', 'allpart')
      .leftJoinAndSelect('reference.model', 'model')
      .leftJoinAndSelect('stockPart.historyStockPart', 'historyStockPart')
      .leftJoinAndSelect('historyStockPart.tracability', 'tracability')
      .leftJoinAndSelect('tracability.user', 'user')
      .where('model.id = :modelId', { modelId })
      .andWhere('branch.id = :branchId', { branchId })
      .andWhere('LOWER(allpart.description) LIKE :desc', { desc: '%complet%' })
      .getMany();
  }

  async dismantle(id: number, binId: number, userId: number): Promise<StockPart> {
    await this.stockPartRepositry.update(id, { bin: { id: binId } });
    await this.AddHistoryStockPart(id, userId, 'Démantèlement');
    return this.findOne(id);
  }

  async createDismantledPart(dto: CreateStockPartDto, userId: number, originalStockPartId: number): Promise<StockPart> {
    const { userId: _uid, bin: binId, reference: refId, serialNumber, ...rest } = dto;
    if (!serialNumber) {
      throw new NotFoundException('Numéro de série obligatoire');
    }
    const finalSerial = this.appService.cleanSpaces(serialNumber);
    const newCreate = this.stockPartRepositry.create({
      ...rest,
      serialNumber: finalSerial,
      bin: binId ? { id: binId } : undefined,
      reference: refId ? { id: refId } : undefined,
    });
    const saved = await this.stockPartRepositry.save(newCreate);
    await this.AddHistoryStockPart(saved.id, userId, `Démantèlement(${originalStockPartId})`);
    return this.findOne(saved.id);
  }



}





