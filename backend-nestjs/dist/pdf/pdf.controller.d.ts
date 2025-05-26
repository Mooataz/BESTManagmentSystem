import { PdfService } from './pdf.service';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import { Response } from 'express';
export declare class PdfController {
    private readonly pdfService;
    constructor(pdfService: PdfService);
    generateRepairPdf(id: number, res: Response): Promise<void>;
    create(createPdfDto: CreatePdfDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: string, updatePdfDto: UpdatePdfDto): string;
    remove(id: string): string;
}
