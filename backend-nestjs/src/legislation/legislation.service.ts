import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLegislationDto } from './dto/create-legislation.dto';
import { UpdateLegislationDto } from './dto/update-legislation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Legislation } from './entities/legislation.entity';
import { AppService } from 'src/app.service';

@Injectable()
export class LegislationService {
  constructor ( @InjectRepository(Legislation) private readonly  legislationRepositry:Repository<Legislation>,
                  private appService: AppService ){}

  async create(createLegislationDto: CreateLegislationDto):Promise<Legislation> {
    createLegislationDto.name =this.appService.cleanSpaces(createLegislationDto.name)

    return await this.legislationRepositry.save(createLegislationDto);
  }

  async findAll():Promise<Legislation[]> {
    const allfind = await this.legislationRepositry.find()

    if (!allfind || allfind.length === 0) { throw new NotFoundException ("There is no data available") }
    return allfind  }

  async findOne(id: number):Promise<Legislation> {
    const Onefind= await this.legislationRepositry.findOne({ where: { id } })

    if ( !Onefind) { throw new NotFoundException("There is no data Available")}
    return Onefind  }

  async update(id: number, updateLegislationDto: UpdateLegislationDto):Promise<Legislation> {
    await this.legislationRepositry.update(id,updateLegislationDto);
    const updatedata = await this.legislationRepositry.findOne({where :{ id }})
    if (!updatedata) { throw new NotFoundException('data Not found for update = failed')}

    return updatedata  }

  async remove(id: number):Promise<Legislation> {
    const deletedata = await this.legislationRepositry.findOne ({where: {id}});
    if (!deletedata) { throw new NotFoundException('data Not found for delete = failed')}
    
    await this.legislationRepositry.delete({ id: deletedata.id })
    return deletedata;  }
}
