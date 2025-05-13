import { AllPart } from "src/all-parts/entities/all-part.entity";
import { ApproveStock } from "src/approve-stock/entities/approve-stock.entity";
import { User } from "src/users/entities/user.entity";
export declare class Sale {
    id: number;
    state: string;
    totalPrice: number;
    date: Date;
    user: User;
    allPart: AllPart[];
    approveStock: ApproveStock;
}
