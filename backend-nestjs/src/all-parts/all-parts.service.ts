import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAllPartDto } from './dto/create-all-part.dto';
import { UpdateAllPartDto } from './dto/update-all-part.dto';
import { AllPart } from './entities/all-part.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';

@Injectable()
export class AllPartsService {
    
  constructor ( @InjectRepository(AllPart) private readonly  allPartRepositry:Repository<AllPart>,private appService: AppService){}
  
  async create(createAllPartDto: CreateAllPartDto):Promise<AllPart> {
    createAllPartDto.description =this.appService.cleanSpaces(createAllPartDto.description)
    return await this.allPartRepositry.save(createAllPartDto);  }

  async findAll():Promise<AllPart[]> {
    const allfind = await this.allPartRepositry.find()
    if (!allfind || allfind.length === 0) {
      throw new NotFoundException ('There is no data available')
    }
    return allfind;
  }

  async findOne(id: number):Promise<AllPart> {
    const onefind = await this.allPartRepositry.findOne({ where : { id } })
    if (!onefind){
      throw new NotFoundException('No data available')
    }
    return onefind;
  }

  async  update(id: number, updateAllPartDto: UpdateAllPartDto):Promise<AllPart> {
    await this.allPartRepositry.update(id,updateAllPartDto);
    const updateData = await this.allPartRepositry.findOne({ where : { id } })

    if (!updateData){
      throw new NotFoundException('data not found to update')
    }    
    return updateData;
  }

   async remove(id: number):Promise<AllPart> {
      const deletedata = await this.allPartRepositry.findOne ({where: {id}});
      if (!deletedata) {
        throw new NotFoundException('data Not found for delete')
      }
      await this.allPartRepositry.delete({ id: deletedata.id })
      return deletedata;
    }
}
