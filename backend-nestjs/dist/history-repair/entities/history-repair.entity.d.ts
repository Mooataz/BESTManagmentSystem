import { Repair } from "src/repair/entities/repair.entity";
import { Tracability } from "src/tracability/entities/tracability.entity";
export declare class HistoryRepair {
    id: number;
    date: Date;
    step: string;
    repair: Repair;
    tracability: Tracability[];
}
