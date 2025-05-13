import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
import { AppController } from 'src/app.controller';


@Injectable()
export class CustomersService {

  constructor(@InjectRepository(Customer) private readonly customerRepositry: Repository<Customer>,
    private appService: AppService
  ) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    createCustomerDto.name = this.appService.cleanSpaces(createCustomerDto.name)
    return await this.customerRepositry.save(createCustomerDto);
  }

  async findAll(): Promise<Customer[]> {
    const allCustomers = await this.customerRepositry.find()
    if (!allCustomers || allCustomers.length === 0) {
      throw new NotFoundException("There is no Customers data Available")
    }
    return allCustomers
  }

  async findOne(id: number): Promise<Customer> {
    const OneCustomer = await this.customerRepositry.findOne({ where: { id } })
    if (!OneCustomer) {
      throw new NotFoundException("There is no Customer data Available")
    }
    return OneCustomer
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    await this.customerRepositry.update(id, updateCustomerDto);
    const updatedata = await this.customerRepositry.findOne({ where: { id } })
    if (!updatedata) {
      throw new NotFoundException('Customer Not found for update = failed')
    }

    return updatedata
  }


  async remove(id: number): Promise<Customer> {
    const deletedata = await this.customerRepositry.findOne({ where: { id } });
    if (!deletedata) {
      throw new NotFoundException('user Not found for delete = failed')
    }
    await this.customerRepositry.delete({ id: deletedata.id })
    return deletedata;
  }

  async findByDistributer(distributerId: number): Promise<Customer[]> {
    const findAll = await this.customerRepositry
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.distributer', 'distributer')
      .where('distributer.id = :distributerId', { distributerId }) // Filtre sur l'ID de repair
      .getMany();
    if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no data Available")
    }
    return findAll
  }

  async findByPhone(phone: number): Promise<Customer[]> {
    const findAll = await this.customerRepositry
      .createQueryBuilder('customer')
      .where('phone = :phone', { phone }) // Filtre sur l'ID de repair
      .getMany();
    if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no data Available")
    }
    return findAll
  }

  async findByName(name: string): Promise<Customer[]> {
    const findAll = await this.customerRepositry
      .createQueryBuilder('customer')
      .where('name = :name', { name }) // Filtre sur l'ID de repair
      .getMany();
    if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no data Available")
    }
    return findAll
  }
}

