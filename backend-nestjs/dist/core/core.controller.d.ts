import { CoreService } from './core.service';
import { CreateCoreDto } from './dto/create-core.dto';
import { UpdateCoreDto } from './dto/update-core.dto';
export declare class CoreController {
    private readonly coreService;
    constructor(coreService: CoreService);
    create(createCoreDto: CreateCoreDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCoreDto: UpdateCoreDto): string;
    remove(id: string): string;
}
