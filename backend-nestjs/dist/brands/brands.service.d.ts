import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
export declare class BrandsService {
    private readonly brandRepositry;
    private appService;
    constructor(brandRepositry: Repository<Brand>, appService: AppService);
    create(createBrandDto: CreateBrandDto): Promise<Brand>;
    findAll(): Promise<Brand[]>;
    findOne(id: number): Promise<Brand>;
    update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand>;
    remove(id: number): Promise<Brand>;
    findByStatus(status: string): Promise<Brand[]>;
}
