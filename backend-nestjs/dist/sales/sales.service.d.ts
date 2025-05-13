import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
export declare class SalesService {
    private readonly saleRepositry;
    constructor(saleRepositry: Repository<Sale>);
    create(createSaleDto: CreateSaleDto): Promise<Sale>;
    findAll(): Promise<Sale[]>;
    findOne(id: number): Promise<Sale>;
    update(id: number, updateSaleDto: UpdateSaleDto): Promise<Sale>;
    remove(id: number): Promise<Sale>;
    findByBranchId(branchId: number): Promise<Sale[]>;
    findByUserId(userId: number): Promise<Sale[]>;
    findByState(state: string): Promise<Sale[]>;
}
