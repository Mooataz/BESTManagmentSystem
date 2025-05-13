import { LegislationService } from './legislation.service';
import { CreateLegislationDto } from './dto/create-legislation.dto';
import { UpdateLegislationDto } from './dto/update-legislation.dto';
export declare class LegislationController {
    private readonly legislationService;
    constructor(legislationService: LegislationService);
    create(createLegislationDto: CreateLegislationDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateLegislationDto: UpdateLegislationDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
