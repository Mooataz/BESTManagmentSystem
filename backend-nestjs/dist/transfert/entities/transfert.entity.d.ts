import { Repair } from "src/repair/entities/repair.entity";
import { StockPart } from "src/stock-parts/entities/stock-part.entity";
export declare class Transfert {
    id: number;
    delivredBy: string;
    sendingDate: Date;
    frombranch: number;
    sendUser: number;
    receivedDate: Date;
    tobranch: number;
    receiveUser: number;
    type: string;
    state: string;
    remark: string;
    typePart: string;
    repair: Repair[];
    stockPart: StockPart[];
}
