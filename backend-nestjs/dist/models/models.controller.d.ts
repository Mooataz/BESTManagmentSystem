import { ModelsService } from './models.service';
import { CreateModelDto } from './dto/create-model.dto';
export declare class ModelsController {
    private readonly modelsService;
    constructor(modelsService: ModelsService);
    create(createModelDto: CreateModelDto, res: any, picture: Express.Multer.File): Promise<any>;
    getBySaleId(brandId: number, res: any): Promise<any>;
    getByTypeModelId(typeModelId: number, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, body: any, res: any, picture: Express.Multer.File): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
