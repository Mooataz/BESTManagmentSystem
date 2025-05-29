import { HistoryRepairService } from './history-repair.service';
import { UpdateHistoryRepairDto } from './dto/update-history-repair.dto';
export declare class HistoryRepairController {
    private readonly historyRepairService;
    constructor(historyRepairService: HistoryRepairService);
    create(date: Date, step: string, repair: number, req: any, res: any): Promise<any>;
    getByRepairId(repairId: number, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateHistoryRepairDto: UpdateHistoryRepairDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
