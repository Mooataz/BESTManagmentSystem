import { CreateReferenceDto } from './dto/create-reference.dto';
import { UpdateReferenceDto } from './dto/update-reference.dto';
import { Reference } from './entities/reference.entity';
import { Repository } from 'typeorm';
import { Model } from 'src/models/entities/model.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { AppService } from 'src/app.service';
export declare class ReferencesService {
    private readonly referenceRepositry;
    private readonly modelRepositry;
    private readonly allPartRepositry;
    private appService;
    constructor(referenceRepositry: Repository<Reference>, modelRepositry: Repository<Model>, allPartRepositry: Repository<AllPart>, appService: AppService);
    create(createReferenceDto: CreateReferenceDto): Promise<Reference>;
    findAll(): Promise<Reference[]>;
    findOne(id: number): Promise<Reference>;
    update(id: number, updateReferenceDto: UpdateReferenceDto): Promise<Reference>;
    remove(id: number): Promise<Reference>;
    findCompatibleReferences(modelId: number, partId: number): Promise<Reference[]>;
    findByMaterialCode(materialCode: string): Promise<Reference[]>;
}
