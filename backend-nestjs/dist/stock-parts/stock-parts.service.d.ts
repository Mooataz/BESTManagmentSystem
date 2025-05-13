import { CreateStockPartDto } from './dto/create-stock-part.dto';
import { UpdateStockPartDto } from './dto/update-stock-part.dto';
import { StockPart } from './entities/stock-part.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
import { Bin } from 'src/bin/entities/bin.entity';
import { ModelsService } from 'src/models/models.service';
import { ReferencesService } from 'src/references/references.service';
import { Reference } from 'src/references/entities/reference.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Company } from 'src/company/entities/company.entity';
export declare class StockPartsService {
    private readonly stockPartRepositry;
    private readonly branchRepositry;
    private readonly binRepositry;
    private readonly companyRepositry;
    private appService;
    private modelService;
    private referenceService;
    private readonly LOCK_FILE;
    private isRunning;
    constructor(stockPartRepositry: Repository<StockPart>, branchRepositry: Repository<Branch>, binRepositry: Repository<Bin>, companyRepositry: Repository<Company>, appService: AppService, modelService: ModelsService, referenceService: ReferencesService);
    create(createStockPartDto: CreateStockPartDto): Promise<StockPart>;
    findAll(): Promise<StockPart[]>;
    findOne(id: number): Promise<StockPart>;
    update(id: number, updateStockPartDto: UpdateStockPartDto): Promise<StockPart>;
    remove(id: number): Promise<StockPart>;
    filterByReferenceAndBin(referencesIds: number[], binId: number): Promise<StockPart[]>;
    findByBinId(binId: number): Promise<StockPart[]>;
    findByBinType(type: string, branchId: number): Promise<StockPart[]>;
    findGoodReference(references: Reference[], branchId: number): Promise<StockPart[]>;
    stateStock(): Promise<{
        branchID: number;
        modelId: number;
        partId: number;
        count: number;
    }[] | undefined>;
}
