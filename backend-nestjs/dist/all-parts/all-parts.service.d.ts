import { CreateAllPartDto } from './dto/create-all-part.dto';
import { UpdateAllPartDto } from './dto/update-all-part.dto';
import { AllPart } from './entities/all-part.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
export declare class AllPartsService {
    private readonly allPartRepositry;
    private appService;
    constructor(allPartRepositry: Repository<AllPart>, appService: AppService);
    create(createAllPartDto: CreateAllPartDto): Promise<AllPart>;
    findAll(): Promise<AllPart[]>;
    findOne(id: number): Promise<AllPart>;
    update(id: number, updateAllPartDto: UpdateAllPartDto): Promise<AllPart>;
    remove(id: number): Promise<AllPart>;
}
