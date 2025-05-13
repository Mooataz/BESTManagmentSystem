import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { Repair } from 'src/repair/entities/repair.entity';
import { User } from 'src/users/entities/user.entity';
import { OtherCost } from 'src/other-cost/entities/other-cost.entity';
export declare class InvoiceService {
    private readonly invoiceRepositry;
    private readonly repairRepositry;
    private readonly userRepositry;
    private readonly otherCostRepositry;
    constructor(invoiceRepositry: Repository<Invoice>, repairRepositry: Repository<Repair>, userRepositry: Repository<User>, otherCostRepositry: Repository<OtherCost>);
    create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice>;
    findAll(): Promise<Invoice[]>;
    findOne(id: number): Promise<Invoice>;
    update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice>;
    remove(id: number): Promise<Invoice>;
    findByBranchId(branchId: number): Promise<Invoice[]>;
    findByUserId(userId: number): Promise<Invoice[]>;
    findByRepairId(repairId: number): Promise<Invoice[]>;
    findByState(state: string): Promise<Invoice[]>;
}
