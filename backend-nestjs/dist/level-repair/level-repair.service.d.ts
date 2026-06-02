import { CreateLevelRepairDto } from './dto/create-level-repair.dto';
import { UpdateLevelRepairDto } from './dto/update-level-repair.dto';
import { LevelRepair } from './entities/level-repair.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
export declare class LevelRepairService {
    private readonly levelRepairRepositry;
    private appService;
    constructor(levelRepairRepositry: Repository<LevelRepair>, appService: AppService);
    create(createLevelRepairDto: CreateLevelRepairDto): Promise<LevelRepair>;
    findAll(): Promise<LevelRepair[]>;
    findOne(id: number): Promise<LevelRepair>;
    update(id: number, updateLevelRepairDto: UpdateLevelRepairDto): Promise<LevelRepair>;
    remove(id: number): Promise<LevelRepair>;
}
