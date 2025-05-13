import { OtherCost } from "src/other-cost/entities/other-cost.entity";
import { Repair } from "src/repair/entities/repair.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    paymentMethod: string;

    @Column()
    date: Date;

    @Column()
    state: string;

    @Column()
    totalPrice: number;

    @ManyToMany( () => OtherCost, (otherCost) => otherCost.invoice)
    @JoinTable()
    otherCost : OtherCost[]; 

    @OneToOne( () => Repair, (repair) => repair.invoice, {nullable: true} )
    @JoinColumn()
    repair: Repair;

    @ManyToOne( () => User, (user) => user.invoice)
    user: User;
}
