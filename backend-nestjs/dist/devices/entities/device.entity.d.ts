import { Customer } from "src/customers/entities/customer.entity";
import { Model } from "src/models/entities/model.entity";
import { Repair } from "src/repair/entities/repair.entity";
export declare class Device {
    id: number;
    serialeNumber?: string;
    purchaseDate?: Date;
    warrentyProof?: string;
    customer: Customer[];
    repair: Repair[];
    model: Model;
}
