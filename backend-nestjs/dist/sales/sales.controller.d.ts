import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto, res: any): Promise<any>;
    getByBranchId(branchId: number, res: any): Promise<any>;
    getByUserId(userId: number, res: any): Promise<any>;
    getByState(state: string, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: string, updateSaleDto: UpdateSaleDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
