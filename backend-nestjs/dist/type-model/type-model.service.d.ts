import { CreateTypeModelDto } from './dto/create-type-model.dto';
import { UpdateTypeModelDto } from './dto/update-type-model.dto';
import { TypeModel } from './entities/type-model.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
export declare class TypeModelService {
    private readonly typeModelRepositry;
    private appService;
    constructor(typeModelRepositry: Repository<TypeModel>, appService: AppService);
    create(createTypeModelDto: CreateTypeModelDto): Promise<TypeModel>;
    findAll(): Promise<TypeModel[]>;
    findOne(id: number): Promise<TypeModel>;
    update(id: number, updateTypeModelDto: UpdateTypeModelDto): Promise<TypeModel>;
    remove(id: number): Promise<TypeModel>;
}
