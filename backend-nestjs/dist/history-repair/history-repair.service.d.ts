import { UpdateHistoryRepairDto } from './dto/update-history-repair.dto';
import { HistoryRepair } from './entities/history-repair.entity';
import { Repository } from 'typeorm';
import { Repair } from 'src/repair/entities/repair.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { User } from 'src/users/entities/user.entity';
export declare class HistoryRepairService {
    private readonly historyRepairRepositry;
    private readonly repairRepositry;
    private readonly tracabilityRepositry;
    private readonly userRepositry;
    constructor(historyRepairRepositry: Repository<HistoryRepair>, repairRepositry: Repository<Repair>, tracabilityRepositry: Repository<Tracability>, userRepositry: Repository<User>);
    create(data: any): Promise<HistoryRepair>;
    findAll(): Promise<HistoryRepair[]>;
    findOne(id: number): Promise<HistoryRepair>;
    update(id: number, updateHistoryRepairDto: UpdateHistoryRepairDto): Promise<HistoryRepair>;
    remove(id: number): Promise<HistoryRepair>;
    findByRepairId(repairId: number): Promise<HistoryRepair[]>;
}
