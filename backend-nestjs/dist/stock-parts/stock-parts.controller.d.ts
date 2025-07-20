import { StockPartsService } from './stock-parts.service';
import { UpdateStockPartDto } from './dto/update-stock-part.dto';
export declare class StockPartsController {
    private readonly stockPartsService;
    constructor(stockPartsService: StockPartsService);
    create(data: any, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateStockPartDto: UpdateStockPartDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
    getByBinId(branchId: number, res: any): Promise<any>;
    filterStockParts(references: number[], binType: number, res: any): Promise<any>;
    getByBinType(type: string, branchId: number, res: any): Promise<any>;
    getStateStock(res: any): Promise<any>;
}
