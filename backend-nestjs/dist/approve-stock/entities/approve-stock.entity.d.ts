import { Repair } from "src/repair/entities/repair.entity";
import { Sale } from "src/sales/entities/sale.entity";
import { StockPart } from "src/stock-parts/entities/stock-part.entity";
export declare class ApproveStock {
    id: number;
    type: string;
    date: Date;
    state: string;
    idPartRepair: number;
    repair: Repair;
    stockPart: StockPart;
    sale: Sale;
}
