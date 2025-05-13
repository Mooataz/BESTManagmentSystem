import { TransfertService } from './transfert.service';
import { CreateTransfertDto } from './dto/create-transfert.dto';
import { UpdateTransfertDto } from './dto/update-transfert.dto';
export declare class TransfertController {
    private readonly transfertService;
    constructor(transfertService: TransfertService);
    create(createTransfertDto: CreateTransfertDto, res: any): Promise<any>;
    getByState(state: string, res: any): Promise<any>;
    getByBranchId(branchId: number, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateTransfertDto: UpdateTransfertDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
