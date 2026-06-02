import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';
import { Accessory } from './entities/accessory.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
export declare class AccessoryService {
    private readonly accessoryRepositry;
    private appService;
    constructor(accessoryRepositry: Repository<Accessory>, appService: AppService);
    create(createAccessoryDto: CreateAccessoryDto): Promise<Accessory>;
    findAll(): Promise<Accessory[]>;
    findOne(id: number): Promise<Accessory>;
    update(id: number, updateAccessoryDto: UpdateAccessoryDto): Promise<Accessory>;
    remove(id: number): Promise<Accessory>;
}
