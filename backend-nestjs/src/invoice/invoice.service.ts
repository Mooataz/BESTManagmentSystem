import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repair } from 'src/repair/entities/repair.entity';
import { User } from 'src/users/entities/user.entity';
import { OtherCost } from 'src/other-cost/entities/other-cost.entity';

@Injectable()
export class InvoiceService {

  constructor ( @InjectRepository(Invoice) private readonly  invoiceRepositry:Repository<Invoice>,
                @InjectRepository(Repair) private readonly  repairRepositry:Repository<Repair>,
                @InjectRepository(User) private readonly  userRepositry:Repository<User>,
                @InjectRepository(OtherCost) private readonly  otherCostRepositry:Repository<OtherCost>
              ){}

  async create(createInvoiceDto: CreateInvoiceDto):Promise<Invoice> {
    const otherCost = await this.otherCostRepositry.find({ where: { id: In(createInvoiceDto.otherCost) }, });
    
    
    const repair = await this.repairRepositry.findOne({ where: { id: createInvoiceDto.repair }, });
    if (!repair) { throw new NotFoundException(`repair with ID ${createInvoiceDto.repair} not found`);}

    const user = await this.userRepositry.findOne({ where: { id: createInvoiceDto.user }, });
    if (!user) { throw new NotFoundException(`user with ID ${createInvoiceDto.user} not found`);}

    const newCreate = await this.invoiceRepositry.create( { ...createInvoiceDto, otherCost:otherCost || undefined, repair, user})
    return await this.invoiceRepositry.save(newCreate);
  }

  async findAll():Promise<Invoice[]> {
    const allfind = await this.invoiceRepositry.find()

    if (!allfind || allfind.length === 0) {
      throw new NotFoundException ("There is no data available")
    }
    return allfind
  }

  async findOne(id: number):Promise<Invoice> {
    const Onefind= await this.invoiceRepositry.findOne({ where: { id } })
    if ( !Onefind){
      throw new NotFoundException("There is no data Available")
    }
    return Onefind  }
    
    async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> { 
      const { otherCost, repair, user , ...rest} = updateInvoiceDto;
      let updateData: Partial<Invoice> = { ...rest };
  
      if (updateInvoiceDto.otherCost !== undefined) {
        const otherCost = await this.otherCostRepositry.find({ where: { id: In(updateInvoiceDto.otherCost) } });
        updateData.otherCost = otherCost; }
        
      if (updateInvoiceDto.repair !== undefined) {
        const repair = await this.repairRepositry.findOne({ where: { id: updateInvoiceDto.repair } });
        if (!repair) { throw new NotFoundException('No repair found'); }
        updateData.repair = repair; }

      if (updateInvoiceDto.repair !== undefined) {
        const user = await this.userRepositry.findOne({ where: { id: updateInvoiceDto.user } });
        if (!user) { throw new NotFoundException('No user found'); }
        updateData.user = user; }


    await this.invoiceRepositry.update(id, updateData);
    const updatedInvoice = await this.invoiceRepositry.findOne({ where: { id }, relations: ['repair','user','otherCost'] });
  
      if (!updatedInvoice) {
          throw new NotFoundException('Reference not found to update');}
        return updatedInvoice;  
  }
  
  
  async remove(id: number):Promise<Invoice> {
    const deletedata = await this.invoiceRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete = failed')
    }
    await this.invoiceRepositry.delete({ id: deletedata.id })
    return deletedata;  }
    
async findByBranchId(branchId: number): Promise<Invoice[]> {
  const findAll = await this.invoiceRepositry
        .createQueryBuilder("invoice")
        .leftJoinAndSelect("invoice.repair", "repair")
        .where("repair.actuellyBranch = :branchId", { branchId })
        .getMany();
  if (!findAll || findAll.length === 0) {
        throw new NotFoundException("There is no data Available") }
    return findAll
} 

async findByUserId(userId: number): Promise<Invoice[]> {
  const findAll = await this.invoiceRepositry
        .createQueryBuilder("invoice")
        .leftJoinAndSelect("invoice.repair", "repair")
        .where("repair.user = :userId", { userId })
        .getMany();
  if (!findAll || findAll.length === 0) {
        throw new NotFoundException("There is no data Available") }
    return findAll
}

async findByRepairId(repairId: number): Promise<Invoice[]> {
  const findAll = await this.invoiceRepositry
        .createQueryBuilder("invoice")
        .leftJoinAndSelect("invoice.repair", "repair")
        .where("repair.id = :repairId", { repairId })
        .getMany();
  if (!findAll || findAll.length === 0) {
        throw new NotFoundException("There is no data Available") }
    return findAll
}

async findByState(state: string): Promise<Invoice[]> {
  const findAll = await this.invoiceRepositry
        .createQueryBuilder("invoice")
        .where("state = :state", { state })
        .getMany();
  if (!findAll || findAll.length === 0) {
        throw new NotFoundException("There is no data Available") }
    return findAll
}

}
