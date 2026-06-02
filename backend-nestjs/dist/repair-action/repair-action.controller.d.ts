import { RepairActionService } from './repair-action.service';
import { CreateRepairActionDto } from './dto/create-repair-action.dto';
import { UpdateRepairActionDto } from './dto/update-repair-action.dto';
export declare class RepairActionController {
    private readonly repairActionService;
    constructor(repairActionService: RepairActionService);
    create(createRepairActionDto: CreateRepairActionDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateRepairActionDto: UpdateRepairActionDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
