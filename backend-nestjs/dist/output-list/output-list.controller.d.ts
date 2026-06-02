import { OutputListService } from './output-list.service';
import { CreateOutputListDto } from './dto/create-output-list.dto';
export declare class OutputListController {
    private readonly outputListService;
    constructor(outputListService: OutputListService);
    create(createOutputListDto: CreateOutputListDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    getByBranchId(branchId: number, res: any): Promise<any>;
    getByCustomerId(customerId: number, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
