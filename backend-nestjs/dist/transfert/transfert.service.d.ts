import { CreateTransfertDto } from './dto/create-transfert.dto';
import { UpdateTransfertDto } from './dto/update-transfert.dto';
import { Transfert } from './entities/transfert.entity';
import { Repository } from 'typeorm';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Repair } from 'src/repair/entities/repair.entity';
export declare class TransfertService {
    private readonly transfertRepositry;
    private readonly stockPartRepositry;
    private readonly repairRepositry;
    constructor(transfertRepositry: Repository<Transfert>, stockPartRepositry: Repository<StockPart>, repairRepositry: Repository<Repair>);
    create(createTransfertDto: CreateTransfertDto): Promise<Transfert>;
    findAll(): Promise<Transfert[]>;
    findOne(id: number): Promise<Transfert>;
    update(id: number, updateTransfertDto: UpdateTransfertDto): Promise<Transfert>;
    remove(id: number): Promise<Transfert>;
    findByState(state: string): Promise<Transfert[]>;
    findByBranchId(branchId: number): Promise<Transfert[]>;
}
