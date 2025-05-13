import { PartsPriceService } from './parts-price.service';
import { CreatePartsPriceDto } from './dto/create-parts-price.dto';
import { UpdatePartsPriceDto } from './dto/update-parts-price.dto';
export declare class PartsPriceController {
    private readonly partsPriceService;
    constructor(partsPriceService: PartsPriceService);
    create(createPartsPriceDto: CreatePartsPriceDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updatePartsPriceDto: UpdatePartsPriceDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
    findPartsPriceByModelAndAllPart(modelId: number, allPartId: number, res: any): Promise<any>;
}
