import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    create(createBrandDto: CreateBrandDto, res: any, logo: Express.Multer.File): Promise<any>;
    getBySaleId(status: string, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateBrandDto: UpdateBrandDto, res: any, logo: Express.Multer.File): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
