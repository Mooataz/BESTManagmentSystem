import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto, res: any): Promise<any>;
    getByDistributerId(distributerId: number, res: any): Promise<any>;
    getByPhone(phone: number, res: any): Promise<any>;
    getByName(name: string, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateCustomerDto: UpdateCustomerDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
