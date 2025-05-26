import { CreatePdfDto } from './dto/create-pdf.dto';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import { Repair } from 'src/repair/entities/repair.entity';
import { Repository } from 'typeorm';
export declare class PdfService {
    private repairRepository;
    constructor(repairRepository: Repository<Repair>);
    generatRepairPdf(repairId: number): Promise<Buffer>;
    create(createPdfDto: CreatePdfDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updatePdfDto: UpdatePdfDto): string;
    remove(id: number): string;
}
