import { User } from "src/users/entities/user.entity";
export declare class Permission {
    id: number;
    description: string;
    user: User[];
}
