import { StockPart } from "src/stock-parts/entities/stock-part.entity";
import { Tracability } from "src/tracability/entities/tracability.entity";
export declare class HistoryStockPart {
    id: number;
    date: Date;
    step: string;
    stockPart: StockPart;
    tracability: Tracability[];
}
