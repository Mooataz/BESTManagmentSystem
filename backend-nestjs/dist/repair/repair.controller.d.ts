import { RepairService } from './repair.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
export declare class RepairController {
    private readonly repairService;
    constructor(repairService: RepairService);
    create(createRepairDto: CreateRepairDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateRepairDto: UpdateRepairDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
    getRepairByDevice(deviceId: string, res: any): Promise<any>;
    getByNewSerialNumber(newSerialNumber: number, res: any): Promise<any>;
    getByActuellyBranch(actuellyBranch: number, res: any): Promise<any>;
    getRepairByUser(userId: string, res: any): Promise<any>;
}
