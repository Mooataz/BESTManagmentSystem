import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpertiseReasonDto } from './dto/create-expertise-reason.dto';
import { UpdateExpertiseReasonDto } from './dto/update-expertise-reason.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpertiseReason } from './entities/expertise-reason.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';

@Injectable()
export class ExpertiseReasonsService {  
  constructor ( @InjectRepository(ExpertiseReason) private readonly  expertiseReasonRepositry:Repository<ExpertiseReason>,
                  private appService: AppService ){}

  async create(createExpertiseReasonDto: CreateExpertiseReasonDto):Promise<ExpertiseReason> {
    createExpertiseReasonDto.name =this.appService.cleanSpaces(createExpertiseReasonDto.name)

    return await this.expertiseReasonRepositry.save(createExpertiseReasonDto);
  }

  async findAll():Promise<ExpertiseReason[]> {
    const allfind = await this.expertiseReasonRepositry.find()

    if (!allfind || allfind.length === 0) {
      throw new NotFoundException ("There is no data available")
    }
    return allfind  }   

  async findOne(id: number):Promise<ExpertiseReason> {
    const Onefind= await this.expertiseReasonRepositry.findOne({ where: { id } })
    if ( !Onefind){
      throw new NotFoundException("There is no data Available")
    }
    return Onefind  }

  async update(id: number, updateExpertiseReasonDto: UpdateExpertiseReasonDto):Promise<ExpertiseReason> {
    await this.expertiseReasonRepositry.update(id,updateExpertiseReasonDto);
    const updatedata = await this.expertiseReasonRepositry.findOne({where :{ id }})
    if (!updatedata) {
      throw new NotFoundException('data Not found for update = failed')
    }

    return updatedata  }

  async remove(id: number):Promise<ExpertiseReason> {
    const deletedata = await this.expertiseReasonRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete = failed')
    }
    await this.expertiseReasonRepositry.delete({ id: deletedata.id })
    return deletedata;  }
}
