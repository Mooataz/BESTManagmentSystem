import { CreateTransfertDto } from './dto/create-transfert.dto';
import { Transfert } from './entities/transfert.entity';
import { Repository } from 'typeorm';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { User } from 'src/users/entities/user.entity';
import { Branch } from 'src/branches/entities/branch.entity';
export declare class TransfertService {
    private readonly transfertRepositry;
    private readonly stockPartRepositry;
    private readonly repairRepositry;
    private readonly userRepositry;
    private readonly branchRepositry;
    constructor(transfertRepositry: Repository<Transfert>, stockPartRepositry: Repository<StockPart>, repairRepositry: Repository<Repair>, userRepositry: Repository<User>, branchRepositry: Repository<Branch>);
    create(createTransfertDto: CreateTransfertDto): Promise<Transfert>;
    findAll(): Promise<Transfert[]>;
    findOne(id: number): Promise<Transfert>;
    update(id: number, data: any): Promise<Transfert>;
    remove(id: number): Promise<Transfert>;
    findByState(state: string): Promise<Transfert[]>;
    getFromBranch(branchId: number, type: string): Promise<any[]>;
    getToBranch(branchId: number, type: string, state: string): Promise<any[]>;
}
