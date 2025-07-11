import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { Repository } from 'typeorm';
import { Repair } from './entities/repair.entity';
import { Accessory } from 'src/accessory/entities/accessory.entity';
import { ListFault } from 'src/list-fault/entities/list-fault.entity';
import { CustomerRequest } from 'src/customer-request/entities/customer-request.entity';
import { NotesCustomer } from 'src/notes-customer/entities/notes-customer.entity';
import { ExpertiseReason } from 'src/expertise-reasons/entities/expertise-reason.entity';
import { RepairAction } from 'src/repair-action/entities/repair-action.entity';
import { Device } from 'src/devices/entities/device.entity';
import { User } from 'src/users/entities/user.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { ApproveStock } from 'src/approve-stock/entities/approve-stock.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { HistoryRepair } from 'src/history-repair/entities/history-repair.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
export declare class RepairService {
    private readonly repairRepositry;
    private readonly accessoryRepositry;
    private readonly listFaultRepositry;
    private readonly customerRequestRepositry;
    private readonly notesCustomerRepositry;
    private readonly expertiseReasonRepositry;
    private readonly repairActionRepositry;
    private readonly deviceRepositry;
    private readonly userRepositry;
    private readonly stockPartRepositry;
    private readonly approveStockRepositry;
    private readonly customerRepositry;
    private readonly historyRepairRepositry;
    private readonly tracabilityRepositry;
    constructor(repairRepositry: Repository<Repair>, accessoryRepositry: Repository<Accessory>, listFaultRepositry: Repository<ListFault>, customerRequestRepositry: Repository<CustomerRequest>, notesCustomerRepositry: Repository<NotesCustomer>, expertiseReasonRepositry: Repository<ExpertiseReason>, repairActionRepositry: Repository<RepairAction>, deviceRepositry: Repository<Device>, userRepositry: Repository<User>, stockPartRepositry: Repository<StockPart>, approveStockRepositry: Repository<ApproveStock>, customerRepositry: Repository<Customer>, historyRepairRepositry: Repository<HistoryRepair>, tracabilityRepositry: Repository<Tracability>);
    create(createRepairDto: CreateRepairDto, userId: number): Promise<Repair>;
    findAll(): Promise<Repair[]>;
    findOne(id: number): Promise<Repair>;
    update(id: number, updateRepairDto: UpdateRepairDto): Promise<Repair>;
    remove(id: number): Promise<Repair>;
    filterRepairByDevice(deviceId: number): Promise<Repair[]>;
    filterRepairByUser(userId: number): Promise<Repair[]>;
    filterByNewSerialNumber(newSerialNumber: number): Promise<Repair[]>;
    filterByActuellyBranch(actuellyBranch: number): Promise<Repair[]>;
    findByBranchAndStep(branchId: number, step: string): Promise<Repair[]>;
    updateRepairWithParts(repairId: number, updateData: UpdateRepairDto): Promise<Repair>;
    FiltreByUserStep(userId: number, steps: string): Promise<Repair[]>;
}
