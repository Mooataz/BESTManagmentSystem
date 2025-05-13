import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOtherCostDto } from './dto/create-other-cost.dto';
import { UpdateOtherCostDto } from './dto/update-other-cost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OtherCost } from './entities/other-cost.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';

@Injectable()
export class OtherCostService {
  constructor ( @InjectRepository(OtherCost) private readonly  otherCostRepositry:Repository<OtherCost>,
                  private appService: AppService ){}

  async create(createOtherCostDto: CreateOtherCostDto):Promise<OtherCost> {
    createOtherCostDto.name =this.appService.cleanSpaces(createOtherCostDto.name)

    return await this.otherCostRepositry.save(createOtherCostDto);
  }

  async findAll():Promise<OtherCost[]> {
    const allfind = await this.otherCostRepositry.find()

    if (!allfind || allfind.length === 0) { throw new NotFoundException ("There is no data available")}
    return allfind
  }

  async findOne(id: number):Promise<OtherCost> {
    const Onefind= await this.otherCostRepositry.findOne({ where: { id } })
    
    if ( !Onefind) { throw new NotFoundException("There is no data Available")}
    return Onefind  }

  async update(id: number, updateOtherCostDto: UpdateOtherCostDto):Promise<OtherCost> {
    await this.otherCostRepositry.update(id,updateOtherCostDto);
    const updatedata = await this.otherCostRepositry.findOne({where :{ id }})
    if (!updatedata) { throw new NotFoundException('data Not found for update = failed') }

    return updatedata 
  }

  async remove(id: number):Promise<OtherCost> {
    const deletedata = await this.otherCostRepositry.findOne ({where: {id}});
    if (!deletedata) { throw new NotFoundException('data Not found for delete = failed')}
    
    await this.otherCostRepositry.delete({ id: deletedata.id })
    return deletedata;  }
}
