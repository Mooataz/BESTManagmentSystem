import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransfertDto } from './dto/create-transfert.dto';
import { UpdateTransfertDto } from './dto/update-transfert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfert } from './entities/transfert.entity';
import { In, Repository } from 'typeorm';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { User } from 'src/users/entities/user.entity';
import { Branch } from 'src/branches/entities/branch.entity';

@Injectable()
export class TransfertService {
  constructor(@InjectRepository(Transfert) private readonly transfertRepositry: Repository<Transfert>,
    @InjectRepository(StockPart) private readonly stockPartRepositry: Repository<StockPart>,
    @InjectRepository(Repair) private readonly repairRepositry: Repository<Repair>,
    @InjectRepository(User) private readonly userRepositry: Repository<User>,
    @InjectRepository(Branch) private readonly branchRepositry: Repository<Branch>) { }

  async create(createTransfertDto: CreateTransfertDto): Promise<Transfert> {

    const stockPart = await this.stockPartRepositry.find({
      where: { id: In(createTransfertDto.stockPartIds ?? []) },
    });
    const repair = await this.repairRepositry.find({
      where: { id: In(createTransfertDto.repairIds ?? []) },
    });


    if ((!stockPart.length) && (!repair.length)) { throw new NotFoundException('No data for transfert') };

    let newCreate
    if (!stockPart.length) {
      newCreate = this.transfertRepositry.create({ ...createTransfertDto, repair })
      await this.repairRepositry
        .createQueryBuilder()
        .update(Repair)
        .set({ actuellybranch: 0 }) // ici on met un nombre, pas une fonction
        .where('id IN (:...ids)', { ids: repair.map(p => p.id) })
        .execute();

    } else {
      newCreate = this.transfertRepositry.create({ ...createTransfertDto, stockPart })
      await this.stockPartRepositry
        .createQueryBuilder()
        .update(StockPart)
        .set({ bin: () => 'NULL' })
        .where('id IN (:...ids)', { ids: stockPart.map(p => p.id) })
        .execute();
    }

    return await this.transfertRepositry.save(newCreate);
  }

  async findAll(): Promise<Transfert[]> {
    const findAll = await this.transfertRepositry.find()
    if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no Transfert available")
    }
    return findAll
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

  if ((!stockPart.length) && (!repair.length)) {
    throw new NotFoundException('No data for transfert');
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
    await this.stockPartRepositry
      .createQueryBuilder()
      .update(StockPart)
      .set({ bin: () => data.bin }) // attention ici : `bin` doit être une expression SQL ou une string
      .where('id IN (:...ids)', { ids: stockPart.map(p => p.id) })
      .execute();
  }

  // Récupérer le transfert à modifier
  const transfert = await this.transfertRepositry.findOne({
    where: { id },
    relations: ['repair', 'stockPart'],
  });

  if (!transfert) {
    throw new NotFoundException('Transfert Not found for update = failed');
  }

  // Mettre à jour les données simples
  Object.assign(transfert, data);

  // Mettre à jour les relations
  transfert.repair = repair;
  transfert.stockPart = stockPart;

  // Sauvegarder le tout
  return await this.transfertRepositry.save(transfert);
}

  async remove(id: number): Promise<Transfert> {
    const deletedata = await this.transfertRepositry.findOne({ where: { id } });
    if (!deletedata) {
      throw new NotFoundException('Transfert Not found for delete = failed')
    }
    await this.transfertRepositry.delete({ id: deletedata.id })
    return deletedata;
  }


  async findByState(state: string): Promise<Transfert[]> {
    const findAll = await this.transfertRepositry
      .createQueryBuilder('transfert')
      .where('state = :state', { state })
      .getMany();
    if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no data Available")
    }
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
      .getMany();
    if (!transferts || transferts.length === 0) {
      throw new NotFoundException('There is no data available');
    }
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
        serialnumber: sp.serialnumber,
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
        stockPart: stockPartsDetail
      });
    }
    return result;
  }


  async getToBranch(branchId: number, type: string, state: string): Promise<any[]> {

    const transferts = await this.transfertRepositry
      .createQueryBuilder('transfert')
      .leftJoinAndSelect('transfert.stockPart', 'stockPart')
      .leftJoinAndSelect('stockPart.reference', 'reference')
      .leftJoinAndSelect('reference.allpart', 'allpart')
      .leftJoinAndSelect('reference.model', 'model')
      .leftJoinAndSelect('stockPart.bin', 'bin')
      .where('transfert.tobranch = :branchId', { branchId })
      .andWhere('transfert.type = :type', { type })
      .andWhere('transfert.state = :state', { state })
      .getMany();

    if (!transferts || transferts.length === 0) {
      throw new NotFoundException('There is no data available');
    }
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
        serialnumber: sp.serialnumber,
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
        stockPart: stockPartsDetail
      });
    }
    return result;


  }

}
