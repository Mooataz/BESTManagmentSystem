import { Invoice } from "src/invoice/entities/invoice.entity";
export declare class OtherCost {
    id: number;
    price: number;
    name: string;
    status: string;
    invoice: Invoice;
}
