import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApproveStockDto } from './dto/create-approve-stock.dto';
import { UpdateApproveStockDto } from './dto/update-approve-stock.dto';
import { ApproveStock } from './entities/approve-stock.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { StockPartsService } from 'src/stock-parts/stock-parts.service';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Bin } from 'src/bin/entities/bin.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class ApproveStockService {
  constructor(@InjectRepository(ApproveStock) private readonly approveStockRepositry: Repository<ApproveStock>,
              @InjectRepository(StockPart) private readonly stockPartRepositry: Repository<StockPart>,
              @InjectRepository(Bin) private readonly binRepositry: Repository<Bin>,
              @InjectRepository(Company) private readonly companyRepositry: Repository<Company>,


              
              ) { }

  async create(createApproveStockDto: CreateApproveStockDto): Promise<ApproveStock> {
    
    return await this.approveStockRepositry.save(createApproveStockDto);
  }

async findByRepairId(repairId: number): Promise<ApproveStock[]> {
  const findAll = await this.approveStockRepositry
          .createQueryBuilder('approveStock')
          .leftJoinAndSelect('approveStock.repair', 'repair')
          .where('repair.id = :repairId', { repairId }) // Filtre sur l'ID de repair
          .getMany();
   if (!findAll || findAll.length === 0) {
        throw new NotFoundException("There is no data Available") }
    return findAll
  }

async findBySaleId(saleId: number): Promise<ApproveStock[]> {
  const findAll = await this.approveStockRepositry
            .createQueryBuilder('approveStock')
            .leftJoinAndSelect('approveStock.sale', 'sale')
            .where('sale.id = :saleId', { saleId }) // Filtre sur l'ID de repair
            .getMany();
  if (!findAll || findAll.length === 0) {
        throw new NotFoundException("There is no data Available") }
  return findAll
    }

async findByBranchId(branchId: number): Promise<ApproveStock[]> {
  const findAll = await this.approveStockRepositry
        .createQueryBuilder("approveStock")
        .leftJoinAndSelect("approveStock.repair", "repair")
        .where("repair.actuellyBranch = :branchId", { branchId })
        .getMany();
  if (!findAll || findAll.length === 0) {
        throw new NotFoundException("There is no data Available") }
    return findAll
} 

async findByType(types: string): Promise<ApproveStock[]> {
  const findAll =  await this.approveStockRepositry
        .createQueryBuilder("approveStock")
        .where("type = :types", { types })
        .getMany();
  if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no data Available") }
  return findAll
} 

async findByState(state: string): Promise<ApproveStock[]> {
  const findAll = await this.approveStockRepositry
        .createQueryBuilder("approveStock")
        .where("state = :state", { state })
        .getMany();
  if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no data Available") }
  return findAll
}

  async findAll(): Promise<ApproveStock[]> {
    const findAll = await this.approveStockRepositry.find()
    if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no data Available") }
    return findAll
  }

  async findOne(id: number): Promise<ApproveStock> {
    const findOne = await this.approveStockRepositry.findOne({ where: { id } })
    if (!findOne) {
      throw new NotFoundException("There is no data Available")
    }
    return findOne
  }

  async update(id: number, updateApproveStockDto: UpdateApproveStockDto): Promise<ApproveStock> {
    await this.approveStockRepositry.update(id, updateApproveStockDto);
    const updatedata = await this.approveStockRepositry.findOne({ where: { id } })
    if (!updatedata) {
      throw new NotFoundException('data Not found for update = failed')
    }
    return updatedata
  }

  async remove(id: number): Promise<ApproveStock> {
    const deletedata = await this.approveStockRepositry.findOne({ where: { id } });
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete = failed')
    }
    await this.approveStockRepositry.delete({ id: deletedata.id })
    return deletedata;
  }
  async updateState(
    id: number,
    binDefectId: number,
    updateApproveStockDto: UpdateApproveStockDto
  ): Promise<ApproveStock> {
    const approveStock = await this.approveStockRepositry.findOne({
      where: { id },
      relations: ['stockPart'],
    });
  
    if (!approveStock) {
      throw new NotFoundException('ApproveStock not found');
    }
  
    // Mettre à jour les champs de ApproveStock
    await this.approveStockRepositry
      .createQueryBuilder()
      .update(ApproveStock)
      .set(updateApproveStockDto)
      .where('id = :id', { id })
      .execute();
  
    // Si state = "Approved", mettre à jour le bin de stockPart
    if (updateApproveStockDto.state === 'Approved' && approveStock.stockPart?.id) {
      await this.stockPartRepositry
        .createQueryBuilder()
        .update(StockPart)
        .set({ bin: { id: binDefectId } }) // Attention : nécessite une relation avec bin déjà existante
        .where('id = :stockPartId', { stockPartId: approveStock.stockPart.id })
        .execute();
    }
  
    // Retourner l'entité mise à jour
    const updatedApproveStock = await this.approveStockRepositry.findOne({
      where: { id },
      relations: ['stockPart', 'stockPart.bin'],
    });
    
    if (!updatedApproveStock) {
      throw new NotFoundException('Pas Trouver la confirmation aprés modification');
    }
 /*   const approveStockWithBranch = await this.approveStockRepositry
  .createQueryBuilder('approveStock')
  .leftJoinAndSelect('approveStock.stockPart', 'stockPart')
  .leftJoinAndSelect('stockPart.bin', 'bin')
  .leftJoinAndSelect('bin.branch', 'branch')
  .where('approveStock.id = :id', { id })
  .getOne();

 const branchId = approveStockWithBranch?.stockPart?.bin?.branch?.id;
if (!branchId) {
  throw new NotFoundException('Branch ID not found');
}
 const arrayState = await this.stockPartService.stateStock(branchId)
 console.log(arrayState, 'array state')  */
 
    return updatedApproveStock;
  }
  
  
}
