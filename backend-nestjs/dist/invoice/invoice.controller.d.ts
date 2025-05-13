import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    create(createInvoiceDto: CreateInvoiceDto, res: any): Promise<any>;
    getBySaleId(branchId: number, res: any): Promise<any>;
    getByUserId(userId: number, res: any): Promise<any>;
    getByRepairId(repairId: number, res: any): Promise<any>;
    getByState(state: string, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateInvoiceDto: UpdateInvoiceDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
}
