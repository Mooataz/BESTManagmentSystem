import { Bin } from "src/bin/entities/bin.entity";
import { Company } from "src/company/entities/company.entity";
import { User } from "src/users/entities/user.entity";
export declare class Branch {
    id: number;
    name: string;
    location: string;
    phone: number;
    email: string;
    company: Company;
    user: User[];
    bin: Bin[];
}
