import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Accessory } from './entities/accessory.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';

@Injectable()
export class AccessoryService {
  constructor ( @InjectRepository(Accessory) private readonly  accessoryRepositry:Repository<Accessory>,private appService: AppService){}

  async  create(createAccessoryDto: CreateAccessoryDto):Promise<Accessory> {
    createAccessoryDto.name =this.appService.cleanSpaces(createAccessoryDto.name)
    return await this.accessoryRepositry.save(createAccessoryDto);  
  }

  async findAll():Promise<Accessory[]> {
    const allfind = await this.accessoryRepositry.find()
    if (!allfind || allfind.length === 0) {
      throw new NotFoundException ('There is no data available')
    }
    return allfind;  }

  async findOne(id: number):Promise<Accessory> {
    const onefind = await this.accessoryRepositry.findOne({ where : { id } })
    if (!onefind){
      throw new NotFoundException('No data available')
    }
    return onefind;  }

  async update(id: number, updateAccessoryDto: UpdateAccessoryDto):Promise<Accessory> {
    await this.accessoryRepositry.update(id,updateAccessoryDto);
    const updateData = await this.accessoryRepositry.findOne({ where : { id } })

    if (!updateData){
      throw new NotFoundException('data not found to update')
    }    
    return updateData;  }

  async remove(id: number):Promise<Accessory> {
    const deletedata = await this.accessoryRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete')
    }
    await this.accessoryRepositry.delete({ id: deletedata.id })
    return deletedata;  }
}
