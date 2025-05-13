import { CreateHistoryRepairDto } from './dto/create-history-repair.dto';
import { UpdateHistoryRepairDto } from './dto/update-history-repair.dto';
import { HistoryRepair } from './entities/history-repair.entity';
import { Repository } from 'typeorm';
import { Repair } from 'src/repair/entities/repair.entity';
export declare class HistoryRepairService {
    private readonly historyRepairRepositry;
    private readonly repairRepositry;
    constructor(historyRepairRepositry: Repository<HistoryRepair>, repairRepositry: Repository<Repair>);
    create(createHistoryRepairDto: CreateHistoryRepairDto): Promise<HistoryRepair>;
    findAll(): Promise<HistoryRepair[]>;
    findOne(id: number): Promise<HistoryRepair>;
    update(id: number, updateHistoryRepairDto: UpdateHistoryRepairDto): Promise<HistoryRepair>;
    remove(id: number): Promise<HistoryRepair>;
    findByRepairId(repairId: number): Promise<HistoryRepair[]>;
}
