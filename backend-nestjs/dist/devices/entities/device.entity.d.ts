import { Model } from "src/models/entities/model.entity";
import { Repair } from "src/repair/entities/repair.entity";
export declare class Device {
    id: number;
    serialenumber: string;
    purchaseDate: Date;
    warrentyProof: string;
    repair: Repair[];
    model: Model;
}
