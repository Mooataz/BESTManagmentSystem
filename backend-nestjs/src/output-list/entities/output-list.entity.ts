import { Customer } from "src/customers/entities/customer.entity";
import { Repair } from "src/repair/entities/repair.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class OutputList {
    @PrimaryGeneratedColumn()
    id : number;
    
    @Column()
    date : Date;

    @Column()
    remark : string;

    @OneToMany( () => Repair, (repair) => repair.outputList)
    @JoinTable()
    repair : Repair[];

    @ManyToOne( () => Customer, (customer) => customer.outputList)
    customer: Customer;
    
    @ManyToOne( () => User, (user) => user.outputList)
    user : User;
}
