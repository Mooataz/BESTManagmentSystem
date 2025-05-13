import { CreateTracabilityDto } from './dto/create-tracability.dto';
import { UpdateTracabilityDto } from './dto/update-tracability.dto';
import { Tracability } from './entities/tracability.entity';
import { Repository } from 'typeorm';
import { HistoryRepair } from 'src/history-repair/entities/history-repair.entity';
import { HistoryStockPart } from 'src/history-stock-part/entities/history-stock-part.entity';
import { User } from 'src/users/entities/user.entity';
export declare class TracabilityService {
    private readonly tracabilityRepositry;
    private readonly historyRepairRepositry;
    private readonly historyStockPartRepositry;
    private readonly userRepositry;
    constructor(tracabilityRepositry: Repository<Tracability>, historyRepairRepositry: Repository<HistoryRepair>, historyStockPartRepositry: Repository<HistoryStockPart>, userRepositry: Repository<User>);
    create(createTracabilityDto: CreateTracabilityDto): Promise<Tracability>;
    findAll(): Promise<Tracability[]>;
    findOne(id: number): Promise<Tracability>;
    update(id: number, updateTracabilityDto: UpdateTracabilityDto): Promise<Tracability>;
    remove(id: number): Promise<Tracability>;
    findByHistoryRepairId(historyRepairId: number): Promise<Tracability>;
    findByHistoryStockPartId(historyStockPartId: number): Promise<Tracability>;
}
