import { LevelRepairService } from './level-repair.service';
import { CreateLevelRepairDto } from './dto/create-level-repair.dto';
import { UpdateLevelRepairDto } from './dto/update-level-repair.dto';
export declare class LevelRepairController {
    private readonly levelRepairService;
    constructor(levelRepairService: LevelRepairService);
    create(createLevelRepairDto: CreateLevelRepairDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateLevelRepairDto: UpdateLevelRepairDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
