import { CreatePartsPriceDto } from './dto/create-parts-price.dto';
import { UpdatePartsPriceDto } from './dto/update-parts-price.dto';
import { PartsPrice } from './entities/parts-price.entity';
import { Repository } from 'typeorm';
import { Model } from 'src/models/entities/model.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { LevelRepair } from 'src/level-repair/entities/level-repair.entity';
export interface ImportRow {
    brandName: string;
    modelName: string;
    allPartDescription: string;
    price: number;
    levelRepairName?: string;
}
export declare class PartsPriceService {
    private readonly partsPriceRepositry;
    private readonly modelRepositry;
    private readonly allPartRepositry;
    private readonly levelRepairRepositry;
    constructor(partsPriceRepositry: Repository<PartsPrice>, modelRepositry: Repository<Model>, allPartRepositry: Repository<AllPart>, levelRepairRepositry: Repository<LevelRepair>);
    getReferences(): Promise<{
        brands: any;
        models: any[];
        allParts: any[];
        levelRepairs: any[];
    }>;
    generateTemplate(): Promise<any>;
    create(createPartsPriceDto: CreatePartsPriceDto): Promise<PartsPrice>;
    findAll(): Promise<PartsPrice[]>;
    findOne(id: number): Promise<PartsPrice>;
    update(id: number, updatePartsPriceDto: UpdatePartsPriceDto): Promise<PartsPrice>;
    remove(id: number): Promise<PartsPrice>;
    importExcel(rows: ImportRow[]): Promise<{
        imported: number;
        errors: string[];
    }>;
    findByModelallPArt(modelId: number, allPartId: number): Promise<PartsPrice>;
}
