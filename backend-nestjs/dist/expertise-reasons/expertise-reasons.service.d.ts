import { CreateExpertiseReasonDto } from './dto/create-expertise-reason.dto';
import { UpdateExpertiseReasonDto } from './dto/update-expertise-reason.dto';
import { ExpertiseReason } from './entities/expertise-reason.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
export declare class ExpertiseReasonsService {
    private readonly expertiseReasonRepositry;
    private appService;
    constructor(expertiseReasonRepositry: Repository<ExpertiseReason>, appService: AppService);
    create(createExpertiseReasonDto: CreateExpertiseReasonDto): Promise<ExpertiseReason>;
    findAll(): Promise<ExpertiseReason[]>;
    findOne(id: number): Promise<ExpertiseReason>;
    update(id: number, updateExpertiseReasonDto: UpdateExpertiseReasonDto): Promise<ExpertiseReason>;
    remove(id: number): Promise<ExpertiseReason>;
}
