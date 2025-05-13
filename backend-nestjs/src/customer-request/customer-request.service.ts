import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerRequestDto } from './dto/create-customer-request.dto';
import { UpdateCustomerRequestDto } from './dto/update-customer-request.dto';
import { CustomerRequest } from './entities/customer-request.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';

@Injectable()
export class CustomerRequestService {
  constructor ( @InjectRepository(CustomerRequest) private readonly customerRequestRepositry:Repository<CustomerRequest>,
                  private appService: AppService){}

  async create(createCustomerRequestDto: CreateCustomerRequestDto):Promise<CustomerRequest> {
    createCustomerRequestDto.name =this.appService.cleanSpaces(createCustomerRequestDto.name)
    return await this.customerRequestRepositry.save(createCustomerRequestDto);
  }

  async findAll():Promise<CustomerRequest[]> {
    const allfind = await this.customerRequestRepositry.find()

    if (!allfind || allfind.length === 0) {
      throw new NotFoundException ("There is no data available")
    }

    return allfind  }

  async findOne(id: number):Promise<CustomerRequest> {
    const Onefind= await this.customerRequestRepositry.findOne({ where: { id } })
    if ( !Onefind){
      throw new NotFoundException("There is no data Available")
    }
    return Onefind  }

  async update(id: number, updateCustomerRequestDto: UpdateCustomerRequestDto):Promise<CustomerRequest> {
    await this.customerRequestRepositry.update(id,updateCustomerRequestDto);
    const updatedata = await this.customerRequestRepositry.findOne({where :{ id }})
    if (!updatedata) {
      throw new NotFoundException('data Not found for update = failed')
    }

    return updatedata  }

  async remove(id: number):Promise<CustomerRequest> {
    const deletedata = await this.customerRequestRepositry.findOne ({where: {id}});
    if (!deletedata) {
      throw new NotFoundException('data Not found for delete = failed')
    }
    await this.customerRequestRepositry.delete({ id: deletedata.id })
    return deletedata;  }
}
