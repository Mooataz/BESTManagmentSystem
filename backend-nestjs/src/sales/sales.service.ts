import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';

@Injectable()
export class SalesService {
  constructor(@InjectRepository(Sale) private readonly saleRepositry: Repository<Sale>) { }

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    return await this.saleRepositry.save(createSaleDto);
  }

  async findAll(): Promise<Sale[]> {
    const allfind = await this.saleRepositry.find()

    if (!allfind || allfind.length === 0) {
      throw new NotFoundException("There is no data available")
    }
    return allfind
  }

  async findOne(id: number): Promise<Sale> {
    const Onefind = await this.saleRepositry.findOne({ where: { id } })
    if (!Onefind) {
      throw new NotFoundException("There is no data Available")
    }
    return Onefind
  }

  async update(id: number, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    await this.saleRepositry.update(id, updateSaleDto);
    const updatedata = await this.saleRepositry.findOne({ where: { id } })
    if (!updatedata) {
      throw new NotFoundException('data Not found for update = failed')
    }

    return updatedata
  }

  async remove(id: number): Promise<Sale> {
    const deletedata = await this.saleRepositry.findOne({ where: { id } });
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete = failed')
    }
    await this.saleRepositry.delete({ id: deletedata.id })
    return deletedata;
  }

  async findByBranchId(branchId: number): Promise<Sale[]> {
    const findAll = await this.saleRepositry
      .createQueryBuilder("sale")
      .leftJoinAndSelect("sale.user", "user")
      .where("user.branch = :branchId", { branchId })
      .getMany();
    if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no data Available")
    }
    return findAll
  }
  
  async findByUserId(userId: number): Promise<Sale[]> {
    const findAll = await this.saleRepositry
      .createQueryBuilder("sale")
      .where("user.id = :userId", { userId })
      .getMany();
    if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no data Available")
    }
    return findAll
  }

   
  async findByState(state: string): Promise<Sale[]> {
    const findAll = await this.saleRepositry
      .createQueryBuilder("sale")
      .where("state = :state", { state })
      .getMany();
    if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no data Available")
    }
    return findAll
  }
}
