import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotesCustomerDto } from './dto/create-notes-customer.dto';
import { UpdateNotesCustomerDto } from './dto/update-notes-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NotesCustomer } from './entities/notes-customer.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';

@Injectable()
export class NotesCustomerService {
  constructor ( @InjectRepository(NotesCustomer) private readonly  notesCustomerRepositry:Repository<NotesCustomer>,
                  private appService: AppService ){}

  async create(createNotesCustomerDto: CreateNotesCustomerDto):Promise<NotesCustomer> {
    createNotesCustomerDto.name =this.appService.cleanSpaces(createNotesCustomerDto.name)

    return await this.notesCustomerRepositry.save(createNotesCustomerDto);
  }

  async findAll():Promise<NotesCustomer[]>  {
    const allfind = await this.notesCustomerRepositry.find()

    if (!allfind || allfind.length === 0) {
      throw new NotFoundException ("There is no data available")
    }
    return allfind  }

  async findOne(id: number):Promise<NotesCustomer>  {
    const Onefind= await this.notesCustomerRepositry.findOne({ where: { id } })
    if ( !Onefind){
      throw new NotFoundException("There is no data Available")
    }
    return Onefind  }

  async update(id: number, updateNotesCustomerDto: UpdateNotesCustomerDto):Promise<NotesCustomer>  {
    await this.notesCustomerRepositry.update(id,updateNotesCustomerDto);
    const updatedata = await this.notesCustomerRepositry.findOne({where :{ id }})
    if (!updatedata) {
      throw new NotFoundException('data Not found for update = failed')
    }

    return updatedata  }

  async remove(id: number):Promise<NotesCustomer>  {
    const deletedata = await this.notesCustomerRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete = failed')
    }
    await this.notesCustomerRepositry.delete({ id: deletedata.id })
    return deletedata;   }
}
