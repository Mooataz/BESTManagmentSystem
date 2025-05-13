import { Branch } from "src/branches/entities/branch.entity";
import { StockPart } from "src/stock-parts/entities/stock-part.entity";
export declare class Bin {
    id: number;
    name: string;
    type: string;
    branch: Branch;
    stockPart: StockPart[];
}
