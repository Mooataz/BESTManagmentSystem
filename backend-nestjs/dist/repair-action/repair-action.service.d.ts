import { CreateRepairActionDto } from './dto/create-repair-action.dto';
import { UpdateRepairActionDto } from './dto/update-repair-action.dto';
import { RepairAction } from './entities/repair-action.entity';
import { Repository } from 'typeorm';
export declare class RepairActionService {
    private readonly repairActionRepositry;
    constructor(repairActionRepositry: Repository<RepairAction>);
    create(createRepairActionDto: CreateRepairActionDto): Promise<RepairAction>;
    findAll(): Promise<RepairAction[]>;
    findOne(id: number): Promise<RepairAction>;
    update(id: number, updateRepairActionDto: UpdateRepairActionDto): Promise<RepairAction>;
    remove(id: number): Promise<RepairAction>;
}
