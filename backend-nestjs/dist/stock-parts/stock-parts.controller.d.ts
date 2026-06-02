import { StockPartsService } from './stock-parts.service';
import { CreateStockPartDto } from './dto/create-stock-part.dto';
import { UpdateStockPartDto } from './dto/update-stock-part.dto';
import { PdfService } from 'src/pdf/pdf.service';
export declare class StockPartsController {
    private readonly stockPartsService;
    private readonly pdfService;
    constructor(stockPartsService: StockPartsService, pdfService: PdfService);
    create(createStockPartDto: CreateStockPartDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    generateTickets(body: {
        ids: number[];
    }, res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateStockPartDto: UpdateStockPartDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
    getByBinId(branchId: number, res: any): Promise<any>;
    filterStockParts(references: number[], binType: number, res: any): Promise<any>;
    getByBinType(type: string, branchId: number, res: any): Promise<any>;
    AddHistoryStockPart(id: number, userId: number, step: string, res: any): Promise<any>;
    findAppareilComplet(modelId: number, branchId: number, res: any): Promise<any>;
    dismantle(id: number, body: {
        binId: number;
        userId: number;
    }, res: any): Promise<any>;
    createDismantled(body: {
        dto: CreateStockPartDto;
        originalStockPartId: number;
    }, res: any): Promise<any>;
}
