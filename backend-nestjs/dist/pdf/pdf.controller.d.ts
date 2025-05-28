import { PdfService } from './pdf.service';
import { Response } from 'express';
import { RepairService } from '../repair/repair.service';
export declare class PdfController {
    private readonly repairService;
    private readonly pdfService;
    constructor(repairService: RepairService, pdfService: PdfService);
    generateRepairsPdf(id: number, res: Response): Promise<void>;
}
