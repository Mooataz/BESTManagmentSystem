import { Customer } from "src/customers/entities/customer.entity";
import { Repair } from "src/repair/entities/repair.entity";
import { User } from "src/users/entities/user.entity";
export declare class OutputList {
    id: number;
    date: Date;
    remark: string;
    repair: Repair[];
    customer: Customer;
    user: User;
}
