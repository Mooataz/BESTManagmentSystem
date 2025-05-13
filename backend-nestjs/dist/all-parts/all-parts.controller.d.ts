import { AllPartsService } from './all-parts.service';
import { CreateAllPartDto } from './dto/create-all-part.dto';
import { UpdateAllPartDto } from './dto/update-all-part.dto';
export declare class AllPartsController {
    private readonly allPartsService;
    constructor(allPartsService: AllPartsService);
    create(createAllPartDto: CreateAllPartDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateAllPartDto: UpdateAllPartDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
