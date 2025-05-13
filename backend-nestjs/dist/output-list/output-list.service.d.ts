import { CreateOutputListDto } from './dto/create-output-list.dto';
import { OutputList } from './entities/output-list.entity';
import { Repository } from 'typeorm';
import { Repair } from 'src/repair/entities/repair.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { User } from 'src/users/entities/user.entity';
export declare class OutputListService {
    private readonly outputListRepositry;
    private readonly repairRepository;
    private readonly customerRepository;
    private readonly userRepository;
    constructor(outputListRepositry: Repository<OutputList>, repairRepository: Repository<Repair>, customerRepository: Repository<Customer>, userRepository: Repository<User>);
    create(createOutputListDto: CreateOutputListDto): Promise<OutputList>;
    findAll(): Promise<OutputList[]>;
    findOne(id: number): Promise<OutputList>;
    findByBranchId(branchId: number): Promise<OutputList[]>;
    findByUserId(userId: number): Promise<OutputList[]>;
    findByCustomerId(customerId: number): Promise<OutputList[]>;
    remove(id: number): Promise<OutputList>;
}
