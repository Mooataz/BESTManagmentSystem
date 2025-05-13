import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransfertDto } from './dto/create-transfert.dto';
import { UpdateTransfertDto } from './dto/update-transfert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfert } from './entities/transfert.entity';
import { In, Repository } from 'typeorm';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Repair } from 'src/repair/entities/repair.entity';

@Injectable()
export class TransfertService {
    constructor ( @InjectRepository(Transfert) private readonly  transfertRepositry:Repository<Transfert>,
                  @InjectRepository(StockPart) private readonly  stockPartRepositry:Repository<StockPart>,
                  @InjectRepository(Repair) private readonly  repairRepositry:Repository<Repair>){}
  
    async create(createTransfertDto: CreateTransfertDto):Promise<Transfert> {

      const stockPart = await this.stockPartRepositry.find({ where : { id: In(createTransfertDto.stockPartIds) },})
      const repair = await this.repairRepositry.find({ where : { id: In(createTransfertDto.repairIds) },})
      
      if ((!stockPart.length) && (!repair.length)) { throw new NotFoundException('No data for transfert')};

      let newCreate
      if (!stockPart.length) {
         newCreate = this.transfertRepositry.create( { ...createTransfertDto, repair } ) 
      }else{
         newCreate = this.transfertRepositry.create( { ...createTransfertDto, stockPart } ) 
      }

      return await this.transfertRepositry.save(newCreate);
    }

  async findAll():Promise<Transfert[]> {
const findAll= await this.transfertRepositry.find()
      if ( !findAll || findAll.length === 0){
        throw new NotFoundException("There is no Transfert available")
      }
      return findAll  }

  async findOne(id: number):Promise<Transfert> {
    const findOne= await this.transfertRepositry.findOne({ where: { id } })
    if ( !findOne){
      throw new NotFoundException("There is no Transfert available")
    }
    return findOne  }

  async update(id: number, updateTransfertDto: UpdateTransfertDto):Promise<Transfert> {
    await this.transfertRepositry.update(id,updateTransfertDto);
    const updatedata = await this.transfertRepositry.findOne({where :{ id }})
    if (!updatedata) {
      throw new NotFoundException('Transfert Not found for update = failed')
    }

    return updatedata  }

  async remove(id: number):Promise<Transfert> {
    const deletedata = await this.transfertRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('Transfert Not found for delete = failed')
    }
    await this.transfertRepositry.delete({ id: deletedata.id })
    return deletedata;  }


    async findByState(state: string): Promise<Transfert[]> {
      const findAll = await  this.transfertRepositry
          .createQueryBuilder('transfert')
          .where('state = :state', { state }) 
          .getMany();
      if (!findAll || findAll.length === 0) {
        throw new NotFoundException("There is no data Available") }
      return findAll
  }

  async findByBranchId(branchId: number): Promise<Transfert[]> {
    const findAll = await this.transfertRepositry
        .createQueryBuilder('transfert')
        .where('fromBranch = :branchId', { branchId }) 
        .orWhere('toBranch = :branchId', { branchId })
        .getMany();

    if (!findAll || findAll.length === 0) {
          throw new NotFoundException("There is no data Available") }
    return findAll
}

}
