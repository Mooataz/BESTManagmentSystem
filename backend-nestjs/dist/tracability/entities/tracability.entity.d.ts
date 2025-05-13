import { HistoryRepair } from "src/history-repair/entities/history-repair.entity";
import { HistoryStockPart } from "src/history-stock-part/entities/history-stock-part.entity";
import { User } from "src/users/entities/user.entity";
export declare class Tracability {
    id: number;
    historyRepair: HistoryRepair;
    historyStockPart: HistoryStockPart;
    user: User;
}
