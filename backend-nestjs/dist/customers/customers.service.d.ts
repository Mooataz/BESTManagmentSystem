import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
export declare class CustomersService {
    private readonly customerRepositry;
    private appService;
    constructor(customerRepositry: Repository<Customer>, appService: AppService);
    create(createCustomerDto: CreateCustomerDto): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    findOne(id: number): Promise<Customer>;
    update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer>;
    remove(id: number): Promise<Customer>;
    findByDistributer(distributerId: number): Promise<Customer[]>;
    findByPhone(phone: number): Promise<Customer[]>;
    findByName(name: string, phone: number, distributer: any): Promise<Customer>;
}
