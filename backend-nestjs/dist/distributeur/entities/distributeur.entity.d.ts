import { Customer } from "src/customers/entities/customer.entity";
export declare class Distributeur {
    id: number;
    name: string;
    phone: number;
    email: string;
    location: string;
    taxRegisterNumber: string;
    customer: Customer[];
}
