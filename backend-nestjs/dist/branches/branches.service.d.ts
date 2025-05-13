import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.entity';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';
import { Company } from 'src/company/entities/company.entity';
export declare class BranchesService {
    private readonly branchRepositry;
    private readonly companyRepositry;
    private appService;
    constructor(branchRepositry: Repository<Branch>, companyRepositry: Repository<Company>, appService: AppService);
    create(createBranchDto: CreateBranchDto): Promise<Branch>;
    findAll(): Promise<Branch[]>;
    findOne(id: number): Promise<Branch>;
    update(id: number, updateBranchDto: UpdateBranchDto): Promise<Branch>;
    remove(id: number): Promise<Branch>;
}
