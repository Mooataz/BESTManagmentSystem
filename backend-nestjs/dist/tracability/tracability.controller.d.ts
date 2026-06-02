import { TracabilityService } from './tracability.service';
import { CreateTracabilityDto } from './dto/create-tracability.dto';
import { UpdateTracabilityDto } from './dto/update-tracability.dto';
export declare class TracabilityController {
    private readonly tracabilityService;
    constructor(tracabilityService: TracabilityService);
    create(createTracabilityDto: CreateTracabilityDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateTracabilityDto: UpdateTracabilityDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
    getByHistoryRepairId(historyRepairId: number, res: any): Promise<any>;
    getByHistoryStockPartId(historyStockPartId: number, res: any): Promise<any>;
}
