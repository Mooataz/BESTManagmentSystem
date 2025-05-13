import { CreateBinDto } from './dto/create-bin.dto';
import { UpdateBinDto } from './dto/update-bin.dto';
import { Bin } from './entities/bin.entity';
import { Repository } from 'typeorm';
import { Branch } from 'src/branches/entities/branch.entity';
import { AppService } from 'src/app.service';
export declare class BinService {
    private readonly binRepositry;
    private readonly branchRepositry;
    private appService;
    constructor(binRepositry: Repository<Bin>, branchRepositry: Repository<Branch>, appService: AppService);
    create(createBinDto: CreateBinDto): Promise<Bin>;
    findAll(): Promise<Bin[]>;
    findOne(id: number): Promise<Bin>;
    update(id: number, updateBinDto: UpdateBinDto): Promise<Bin>;
    remove(id: number): Promise<Bin>;
    findByBranchId(branchId: number): Promise<Bin[]>;
    findByBranchIdAndType(branchId: number, type: string): Promise<Bin[]>;
}
