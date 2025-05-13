import { ApproveStock } from "src/approve-stock/entities/approve-stock.entity";
import { Bin } from "src/bin/entities/bin.entity";
import { HistoryStockPart } from "src/history-stock-part/entities/history-stock-part.entity";
import { Reference } from "src/references/entities/reference.entity";
import { Transfert } from "src/transfert/entities/transfert.entity";
export declare class StockPart {
    id: number;
    remark: string;
    serialNumber: string;
    bin: Bin;
    reference: Reference;
    historyStockPart: HistoryStockPart[];
    approveStock: ApproveStock;
    transfert: Transfert;
}
