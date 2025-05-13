import { BinService } from './bin.service';
import { CreateBinDto } from './dto/create-bin.dto';
import { UpdateBinDto } from './dto/update-bin.dto';
export declare class BinController {
    private readonly binService;
    constructor(binService: BinService);
    create(createBinDto: CreateBinDto, res: any): Promise<any>;
    getByBranchId(branchId: number, res: any): Promise<any>;
    getByBranchIdAndType(branchId: number, type: string, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateBinDto: UpdateBinDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
