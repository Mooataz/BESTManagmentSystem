import { UpdateHistoryStockPartDto } from './dto/update-history-stock-part.dto';
import { Repository } from 'typeorm';
import { HistoryStockPart } from './entities/history-stock-part.entity';
import { User } from 'src/users/entities/user.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
export declare class HistoryStockPartService {
    private readonly historyStockPartRepositry;
    private readonly userRepositry;
    private readonly tracabilityRepositry;
    private readonly stockPartRepositry;
    constructor(historyStockPartRepositry: Repository<HistoryStockPart>, userRepositry: Repository<User>, tracabilityRepositry: Repository<Tracability>, stockPartRepositry: Repository<StockPart>);
    create(data: any): Promise<HistoryStockPart>;
    findAll(): Promise<HistoryStockPart[]>;
    findOne(id: number): Promise<HistoryStockPart>;
    update(id: number, updateHistoryStockPartDto: UpdateHistoryStockPartDto): Promise<HistoryStockPart>;
    remove(id: number): Promise<HistoryStockPart>;
    findByStockPartId(stockPartId: number): Promise<HistoryStockPart[]>;
}
