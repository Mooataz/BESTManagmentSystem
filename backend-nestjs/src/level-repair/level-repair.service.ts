import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLevelRepairDto } from './dto/create-level-repair.dto';
import { UpdateLevelRepairDto } from './dto/update-level-repair.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelRepair } from './entities/level-repair.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';

@Injectable()
export class LevelRepairService {
  constructor ( @InjectRepository(LevelRepair) private readonly  levelRepairRepositry:Repository<LevelRepair>,
                  private appService: AppService ){}

  async create(createLevelRepairDto: CreateLevelRepairDto):Promise<LevelRepair> {
    createLevelRepairDto.name =this.appService.cleanSpaces(createLevelRepairDto.name)

    return await this.levelRepairRepositry.save(createLevelRepairDto);
  }

  async findAll():Promise<LevelRepair[]> {
    const allfind = await this.levelRepairRepositry.find()

    if (!allfind || allfind.length === 0) {
      throw new NotFoundException ("There is no data available")
    }
    return allfind   }

  async findOne(id: number):Promise<LevelRepair> {
    const Onefind= await this.levelRepairRepositry.findOne({ where: { id } })
    if ( !Onefind){
      throw new NotFoundException("There is no data Available")
    }
    return Onefind  }

  async update(id: number, updateLevelRepairDto: UpdateLevelRepairDto):Promise<LevelRepair> {
    await this.levelRepairRepositry.update(id,updateLevelRepairDto);
    const updatedata = await this.levelRepairRepositry.findOne({where :{ id }})
    if (!updatedata) {
      throw new NotFoundException('data Not found for update = failed')
    }

    return updatedata  }

  async remove(id: number):Promise<LevelRepair>{
    const deletedata = await this.levelRepairRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete = failed')
    }
    await this.levelRepairRepositry.delete({ id: deletedata.id })
    return deletedata;  }
}
