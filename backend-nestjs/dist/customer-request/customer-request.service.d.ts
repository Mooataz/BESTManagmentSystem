import { CreateCustomerRequestDto } from './dto/create-customer-request.dto';
import { UpdateCustomerRequestDto } from './dto/update-customer-request.dto';
import { CustomerRequest } from './entities/customer-request.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
export declare class CustomerRequestService {
    private readonly customerRequestRepositry;
    private appService;
    constructor(customerRequestRepositry: Repository<CustomerRequest>, appService: AppService);
    create(createCustomerRequestDto: CreateCustomerRequestDto): Promise<CustomerRequest>;
    findAll(): Promise<CustomerRequest[]>;
    findOne(id: number): Promise<CustomerRequest>;
    update(id: number, updateCustomerRequestDto: UpdateCustomerRequestDto): Promise<CustomerRequest>;
    remove(id: number): Promise<CustomerRequest>;
}
