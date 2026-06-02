import { AccessoryService } from './accessory.service';
import { CreateAccessoryDto } from './dto/create-accessory.dto';
import { UpdateAccessoryDto } from './dto/update-accessory.dto';
export declare class AccessoryController {
    private readonly accessoryService;
    constructor(accessoryService: AccessoryService);
    create(createAccessoryDto: CreateAccessoryDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateAccessoryDto: UpdateAccessoryDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
