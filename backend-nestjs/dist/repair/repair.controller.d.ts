import { RepairService } from './repair.service';
import { UpdateRepairDto } from './dto/update-repair.dto';
export declare class RepairController {
    private readonly repairService;
    constructor(repairService: RepairService);
    create(body: any, res: any): Promise<any>;
    findByBranchAndStep(branchId: number, step: string, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    updateWithPartsFiles(id: number, updateRepairDto: UpdateRepairDto, files?: Express.Multer.File[]): Promise<{
        message: string;
        data: import("./entities/repair.entity").Repair;
    }>;
    removeFile(id: number, fileId: string, res: any): Promise<any>;
    update(id: number, body: any, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
    getRepairByDevice(deviceId: string, res: any): Promise<any>;
    getByNewSerialNumber(newSerialNumber: number, res: any): Promise<any>;
    getByActuellyBranch(actuellyBranch: number, res: any): Promise<any>;
    getRepairByUser(userId: string, res: any): Promise<any>;
    getByUserStep(branchId: string, userId: string, steps: string, res: any): Promise<any>;
}
