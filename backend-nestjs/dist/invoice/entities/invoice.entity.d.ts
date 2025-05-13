import { OtherCost } from "src/other-cost/entities/other-cost.entity";
import { Repair } from "src/repair/entities/repair.entity";
import { User } from "src/users/entities/user.entity";
export declare class Invoice {
    id: number;
    paymentMethod: string;
    date: Date;
    state: string;
    totalPrice: number;
    otherCost: OtherCost[];
    repair: Repair;
    user: User;
}
