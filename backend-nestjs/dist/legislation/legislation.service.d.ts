import { CreateLegislationDto } from './dto/create-legislation.dto';
import { UpdateLegislationDto } from './dto/update-legislation.dto';
import { Repository } from 'typeorm';
import { Legislation } from './entities/legislation.entity';
import { AppService } from 'src/app.service';
export declare class LegislationService {
    private readonly legislationRepositry;
    private appService;
    constructor(legislationRepositry: Repository<Legislation>, appService: AppService);
    create(createLegislationDto: CreateLegislationDto): Promise<Legislation>;
    findAll(): Promise<Legislation[]>;
    findOne(id: number): Promise<Legislation>;
    update(id: number, updateLegislationDto: UpdateLegislationDto): Promise<Legislation>;
    remove(id: number): Promise<Legislation>;
}
