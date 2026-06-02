import { ExpertiseReasonsService } from './expertise-reasons.service';
import { CreateExpertiseReasonDto } from './dto/create-expertise-reason.dto';
import { UpdateExpertiseReasonDto } from './dto/update-expertise-reason.dto';
export declare class ExpertiseReasonsController {
    private readonly expertiseReasonsService;
    constructor(expertiseReasonsService: ExpertiseReasonsService);
    create(createExpertiseReasonDto: CreateExpertiseReasonDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateExpertiseReasonDto: UpdateExpertiseReasonDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
