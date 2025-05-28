import { Repair } from '../repair/entities/repair.entity';
export declare class PdfService {
    generatRepairPdf(repair: Repair): Promise<Buffer>;
}
