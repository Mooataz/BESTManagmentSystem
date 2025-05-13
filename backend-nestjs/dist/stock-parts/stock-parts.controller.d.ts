import { StockPartsService } from './stock-parts.service';
import { CreateStockPartDto } from './dto/create-stock-part.dto';
import { UpdateStockPartDto } from './dto/update-stock-part.dto';
export declare class StockPartsController {
    private readonly stockPartsService;
    constructor(stockPartsService: StockPartsService);
    create(createStockPartDto: CreateStockPartDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateStockPartDto: UpdateStockPartDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
    getByBinId(binId: number, res: any): Promise<any>;
    filterStockParts(references: number[], binType: number, res: any): Promise<any>;
    getByBinType(type: string, branchId: number, res: any): Promise<any>;
    getStateStock(res: any): Promise<any>;
}
