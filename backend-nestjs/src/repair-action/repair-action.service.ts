import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRepairActionDto } from './dto/create-repair-action.dto';
import { UpdateRepairActionDto } from './dto/update-repair-action.dto';
import { RepairAction } from './entities/repair-action.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RepairActionService {
  constructor ( @InjectRepository(RepairAction) private readonly  repairActionRepositry:Repository<RepairAction>){}

  async create(createRepairActionDto: CreateRepairActionDto):Promise<RepairAction> {
    return await this.repairActionRepositry.save(createRepairActionDto);
  }

  async findAll():Promise<RepairAction[]> {
    const allfind = await this.repairActionRepositry.find()

    if (!allfind || allfind.length === 0) {
      throw new NotFoundException  ("There is no data available")
    }
    return allfind  }

  async findOne(id: number):Promise<RepairAction> {
    const Onefind= await this.repairActionRepositry.findOne({ where: { id } })
    if ( !Onefind){
      throw new NotFoundException("There is no data Available")
    }
    return Onefind  }

  async update(id: number, updateRepairActionDto: UpdateRepairActionDto):Promise<RepairAction> {
    await this.repairActionRepositry.update(id,updateRepairActionDto);
    const updatedata = await this.repairActionRepositry.findOne({where :{ id }})
    if (!updatedata) {
      throw new NotFoundException('data Not found for update = failed')
    }

    return updatedata  }

  async remove(id: number):Promise<RepairAction> {
    const deletedata = await this.repairActionRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete = failed')
    }
    await this.repairActionRepositry.delete({ id: deletedata.id })
    return deletedata;  }
}
