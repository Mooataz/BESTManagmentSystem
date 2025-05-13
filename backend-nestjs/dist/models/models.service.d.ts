import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { Model } from './entities/model.entity';
import { Repository } from 'typeorm';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { AppService } from 'src/app.service';
export declare class ModelsService {
    private readonly modelRepositry;
    private readonly allPartRepositry;
    private appService;
    constructor(modelRepositry: Repository<Model>, allPartRepositry: Repository<AllPart>, appService: AppService);
    create(createModelDto: CreateModelDto): Promise<Model>;
    findAll(): Promise<Model[]>;
    findOne(id: number): Promise<Model>;
    update(id: number, updateModelDto: UpdateModelDto): Promise<Model>;
    remove(id: number): Promise<Model>;
    findByBrandId(brandId: number): Promise<Model[]>;
    findByTypeModelId(typeModelId: number): Promise<Model[]>;
}
