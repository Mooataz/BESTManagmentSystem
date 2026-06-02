import { TypeModelService } from './type-model.service';
import { CreateTypeModelDto } from './dto/create-type-model.dto';
import { UpdateTypeModelDto } from './dto/update-type-model.dto';
export declare class TypeModelController {
    private readonly typeModelService;
    constructor(typeModelService: TypeModelService);
    create(createTypeModelDto: CreateTypeModelDto, res: any, req: Request): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateTypeModelDto: UpdateTypeModelDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
