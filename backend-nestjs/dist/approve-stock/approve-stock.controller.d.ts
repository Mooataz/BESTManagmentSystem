import { ApproveStockService } from './approve-stock.service';
import { CreateApproveStockDto } from './dto/create-approve-stock.dto';
import { UpdateApproveStockDto } from './dto/update-approve-stock.dto';
export declare class ApproveStockController {
    private readonly approveStockService;
    constructor(approveStockService: ApproveStockService);
    create(createApproveStockDto: CreateApproveStockDto, res: any): Promise<any>;
    getByRepairId(repairId: number, res: any): Promise<any>;
    getBySaleId(saleId: number, res: any): Promise<any>;
    getByBranchId(branchId: number, res: any): Promise<any>;
    getByType(type: string, res: any): Promise<any>;
    getByState(state: string, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateApproveStockDto: UpdateApproveStockDto, res: any): Promise<any>;
    updateStateApprove(id: number, binDefectId: number, updateApproveStockDto: UpdateApproveStockDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
