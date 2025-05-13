import { Device } from "src/devices/entities/device.entity";
import { Distributeur } from "src/distributeur/entities/distributeur.entity";
import { OutputList } from "src/output-list/entities/output-list.entity";
export declare class Customer {
    id: number;
    name: string;
    phone: number;
    distributer: Distributeur;
    device: Device[];
    outputList: OutputList[];
}
