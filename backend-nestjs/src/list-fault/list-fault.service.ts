import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListFaultDto } from './dto/create-list-fault.dto';
import { UpdateListFaultDto } from './dto/update-list-fault.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ListFault } from './entities/list-fault.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';

@Injectable()
export class ListFaultService {
  constructor ( @InjectRepository(ListFault) private readonly  listFaultRepositry:Repository<ListFault>,
                  private appService: AppService ){}

  async create(createListFaultDto: CreateListFaultDto):Promise<ListFault> {
    createListFaultDto.name =this.appService.cleanSpaces(createListFaultDto.name)

    return await this.listFaultRepositry.save(createListFaultDto);
  }

  async findAll():Promise<ListFault[]> {
    const allfind = await this.listFaultRepositry.find()

    if (!allfind || allfind.length === 0) {
      throw new NotFoundException ("There is no data available")
    }

    return allfind  }

  async findOne(id: number):Promise<ListFault> {
    const Onefind= await this.listFaultRepositry.findOne({ where: { id } })
    if ( !Onefind){
      throw new NotFoundException("There is no data Available")
    }
    return Onefind  }

  async update(id: number, updateListFaultDto: UpdateListFaultDto):Promise<ListFault> {
    await this.listFaultRepositry.update(id,updateListFaultDto);
    const updatedata = await this.listFaultRepositry.findOne({where :{ id }})
    if (!updatedata) {
      throw new NotFoundException('data Not found for update = failed')
    }

    return updatedata  }

  async remove(id: number):Promise<ListFault> {
    const deletedata = await this.listFaultRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete = failed')
    }
    await this.listFaultRepositry.delete({ id: deletedata.id })
    return deletedata;  }
}
