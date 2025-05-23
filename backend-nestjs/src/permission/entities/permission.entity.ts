import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
        id : number;
    @Column()
        description : string;

   /*  @ManyToMany( () => User,user =>user.permissions)
    user : User[]  */
}
