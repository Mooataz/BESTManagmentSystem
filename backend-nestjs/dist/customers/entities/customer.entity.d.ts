import { Distributeur } from "src/distributeur/entities/distributeur.entity";
import { OutputList } from "src/output-list/entities/output-list.entity";
import { Repair } from "src/repair/entities/repair.entity";
export declare class Customer {
    id: number;
    name: string;
    phone: number;
    distributer: Distributeur;
    repair: Repair;
    outputList: OutputList[];
}
