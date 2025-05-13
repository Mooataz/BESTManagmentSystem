import { ModelsService } from './models.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
export declare class ModelsController {
    private readonly modelsService;
    constructor(modelsService: ModelsService);
    create(createModelDto: CreateModelDto, res: any, picture: Express.Multer.File): Promise<any>;
    getBySaleId(brandId: number, res: any): Promise<any>;
    getByTypeModelId(typeModelId: number, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateModelDto: UpdateModelDto, res: any, picture: Express.Multer.File): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
