import { CreateHistoryStockPartDto } from './dto/create-history-stock-part.dto';
import { UpdateHistoryStockPartDto } from './dto/update-history-stock-part.dto';
import { Repository } from 'typeorm';
import { HistoryStockPart } from './entities/history-stock-part.entity';
export declare class HistoryStockPartService {
    private readonly historyStockPartRepositry;
    constructor(historyStockPartRepositry: Repository<HistoryStockPart>);
    create(createHistoryStockPartDto: CreateHistoryStockPartDto): Promise<HistoryStockPart>;
    findAll(): Promise<HistoryStockPart[]>;
    findOne(id: number): Promise<HistoryStockPart>;
    update(id: number, updateHistoryStockPartDto: UpdateHistoryStockPartDto): Promise<HistoryStockPart>;
    remove(id: number): Promise<HistoryStockPart>;
    findByStockPartId(stockPartId: number): Promise<HistoryStockPart[]>;
}
