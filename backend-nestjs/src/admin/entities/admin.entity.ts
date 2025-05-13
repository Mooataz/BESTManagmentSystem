import { User } from "src/users/entities/user.entity";
import { ChildEntity, Column } from "typeorm";

//@ChildEntity()
export class Admin extends User {
    @Column()
    adminCode: string;
}
