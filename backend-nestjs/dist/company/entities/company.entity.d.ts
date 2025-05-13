import { Branch } from "src/branches/entities/branch.entity";
export declare class Company {
    id: number;
    name: string;
    headquarterslocation: string;
    taxRegisterNumber: string;
    rib: Number;
    bank: string;
    logo: string;
    quantityAlertStock: number;
    branches: Branch[];
}
