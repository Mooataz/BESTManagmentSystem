import { CreateApproveStockDto } from './dto/create-approve-stock.dto';
import { UpdateApproveStockDto } from './dto/update-approve-stock.dto';
import { ApproveStock } from './entities/approve-stock.entity';
import { Repository } from 'typeorm';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Bin } from 'src/bin/entities/bin.entity';
import { Company } from 'src/company/entities/company.entity';
export declare class ApproveStockService {
    private readonly approveStockRepositry;
    private readonly stockPartRepositry;
    private readonly binRepositry;
    private readonly companyRepositry;
    constructor(approveStockRepositry: Repository<ApproveStock>, stockPartRepositry: Repository<StockPart>, binRepositry: Repository<Bin>, companyRepositry: Repository<Company>);
    create(createApproveStockDto: CreateApproveStockDto): Promise<ApproveStock>;
    findByRepairId(repairId: number): Promise<ApproveStock[]>;
    findBySaleId(saleId: number): Promise<ApproveStock[]>;
    findByBranchId(branchId: number): Promise<ApproveStock[]>;
    findByType(types: string): Promise<ApproveStock[]>;
    findByState(state: string): Promise<ApproveStock[]>;
    findAll(): Promise<ApproveStock[]>;
    findOne(id: number): Promise<ApproveStock>;
    update(id: number, updateApproveStockDto: UpdateApproveStockDto): Promise<ApproveStock>;
    remove(id: number): Promise<ApproveStock>;
    updateState(id: number, binDefectId: number, updateApproveStockDto: UpdateApproveStockDto): Promise<ApproveStock>;
}
