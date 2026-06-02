import { Repository } from 'typeorm';
import { Repair } from '../repair/entities/repair.entity';
import { Company } from 'src/company/entities/company.entity';
import { Legislation } from 'src/legislation/entities/legislation.entity';
import { Branch } from 'src/branches/entities/branch.entity';
export declare class PdfService {
    private readonly companyRepository;
    private readonly legislationRepository;
    private readonly repairRepository;
    private readonly branchRepository;
    constructor(companyRepository: Repository<Company>, legislationRepository: Repository<Legislation>, repairRepository: Repository<Repair>, branchRepository: Repository<Branch>);
    generatRepairPdf(repair: Repair): Promise<Buffer>;
    private drawTwoColumnBox;
    generateStockReport(branchId: number, parts: {
        modelName: string;
        partName: string;
        count: number;
    }[]): Promise<string>;
    generateStockAlertPdf(alertId: number, branchId: number, report: {
        brand: string;
        model: string;
        part: string;
        quantity: number;
    }[]): Promise<Buffer>;
    generateReceptionAlertPdf(alertId: number, branchId: number, report: {
        repairId: number;
        customerName: string;
        deviceModel: string;
        serialNumber: string;
        creationDate: Date;
    }[]): Promise<Buffer>;
    generateAffectationAlertPdf(alertId: number, branchId: number, report: {
        repairId: number;
        customerName: string;
        deviceModel: string;
        serialNumber: string;
        creationDate: Date;
    }[]): Promise<Buffer>;
    generateReparationAlertPdf(alertId: number, branchId: number, report: {
        repairId: number;
        customerName: string;
        deviceModel: string;
        serialNumber: string;
        creationDate: Date;
    }[]): Promise<Buffer>;
    generateCqAlertPdf(alertId: number, branchId: number, report: {
        repairId: number;
        customerName: string;
        deviceModel: string;
        serialNumber: string;
        creationDate: Date;
    }[]): Promise<Buffer>;
    generateStockPartTicketPdf(stockParts: any[]): Promise<Buffer>;
    generateBloqueAlertPdf(alertId: number, branchId: number, report: {
        step: string;
        count: number;
    }[]): Promise<Buffer>;
}
