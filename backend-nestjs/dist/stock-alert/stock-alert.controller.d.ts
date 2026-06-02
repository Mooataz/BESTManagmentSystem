import { StockAlertService } from './stock-alert.service';
import { PdfService } from 'src/pdf/pdf.service';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { Branch } from 'src/branches/entities/branch.entity';
export declare class StockAlertController {
    private readonly service;
    private readonly pdfService;
    private readonly branchRepo;
    constructor(service: StockAlertService, pdfService: PdfService, branchRepo: Repository<Branch>);
    generateForBranch(branchId: string): Promise<import("./entities/stock-alert.entity").StockAlert | null>;
    generateAll(): Promise<import("./entities/stock-alert.entity").StockAlert[]>;
    generateReception(branchId: string): Promise<import("./entities/stock-alert.entity").StockAlert | null>;
    generateReceptionAll(): Promise<import("./entities/stock-alert.entity").StockAlert[]>;
    generateAffectation(branchId: string): Promise<import("./entities/stock-alert.entity").StockAlert | null>;
    generateAffectationAll(): Promise<import("./entities/stock-alert.entity").StockAlert[]>;
    generateReparation(branchId: string): Promise<import("./entities/stock-alert.entity").StockAlert | null>;
    generateReparationAll(): Promise<import("./entities/stock-alert.entity").StockAlert[]>;
    generateCq(branchId: string): Promise<import("./entities/stock-alert.entity").StockAlert | null>;
    generateCqAll(): Promise<import("./entities/stock-alert.entity").StockAlert[]>;
    generateBloque(branchId: string): Promise<import("./entities/stock-alert.entity").StockAlert | null>;
    generateBloqueAll(): Promise<import("./entities/stock-alert.entity").StockAlert[]>;
    downloadPdf(id: string, branchId: string, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAlerts(branchId: string, userId: string): Promise<{
        isRead: boolean;
        id: number;
        branchId: number;
        type: string;
        report: Record<string, any>[];
        readBy: string[];
        createdAt: Date;
    }[]>;
    getAlertsByType(branchId: string, userId: string, type: string): Promise<{
        isRead: boolean;
        id: number;
        branchId: number;
        type: string;
        report: Record<string, any>[];
        readBy: string[];
        createdAt: Date;
    }[]>;
    markAsRead(id: string, userId: string): Promise<import("./entities/stock-alert.entity").StockAlert | null>;
}
