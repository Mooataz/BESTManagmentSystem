import { HttpStatus } from '@nestjs/common';
import { PartsPriceService } from './parts-price.service';
import { CreatePartsPriceDto } from './dto/create-parts-price.dto';
import { UpdatePartsPriceDto } from './dto/update-parts-price.dto';
export declare class PartsPriceController {
    private readonly partsPriceService;
    constructor(partsPriceService: PartsPriceService);
    create(createPartsPriceDto: CreatePartsPriceDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    getViewData(branchId: string): Promise<{
        message: string;
        status: HttpStatus;
        data: any;
    }>;
    getAvailability(): Promise<{
        message: string;
        status: HttpStatus;
        data: any;
    }>;
    getReferences(): Promise<{
        message: string;
        status: HttpStatus;
        data: {
            brands: any;
            models: any[];
            allParts: any[];
            levelRepairs: any[];
        };
    }>;
    downloadTemplate(res: any): Promise<void>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updatePartsPriceDto: UpdatePartsPriceDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
    importExcel(file: Express.Multer.File, req: any, res: any): Promise<any>;
    getDevisInfo(body: {
        modelId: number;
        partIds: number[];
    }, res: any): Promise<any>;
    findPartsPriceByModelAndAllPart(modelId: number, allPartId: number, res: any): Promise<any>;
}
