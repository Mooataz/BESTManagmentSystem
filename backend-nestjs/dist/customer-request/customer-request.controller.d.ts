import { CustomerRequestService } from './customer-request.service';
import { CreateCustomerRequestDto } from './dto/create-customer-request.dto';
import { UpdateCustomerRequestDto } from './dto/update-customer-request.dto';
export declare class CustomerRequestController {
    private readonly customerRequestService;
    constructor(customerRequestService: CustomerRequestService);
    create(createCustomerRequestDto: CreateCustomerRequestDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateCustomerRequestDto: UpdateCustomerRequestDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
