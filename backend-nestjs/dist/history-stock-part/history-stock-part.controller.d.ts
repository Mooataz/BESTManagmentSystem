import { HistoryStockPartService } from './history-stock-part.service';
import { CreateHistoryStockPartDto } from './dto/create-history-stock-part.dto';
import { UpdateHistoryStockPartDto } from './dto/update-history-stock-part.dto';
export declare class HistoryStockPartController {
    private readonly historyStockPartService;
    constructor(historyStockPartService: HistoryStockPartService);
    create(createHistoryStockPartDto: CreateHistoryStockPartDto, res: any): Promise<any>;
    getByStockPartId(stockPartId: number, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateHistoryStockPartDto: UpdateHistoryStockPartDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
