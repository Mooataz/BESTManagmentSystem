import { AllPart } from "src/all-parts/entities/all-part.entity";
import { ApproveStock } from "src/approve-stock/entities/approve-stock.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Sale {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    state: string;

    @Column('float')
    totalPrice: number;

    @Column()
    date: Date;

    @ManyToOne( () => User, (user) => user.sale)
    user: User;

    @ManyToMany( () => AllPart, (allPart) => allPart.sale)
    allPart: AllPart[];

    @OneToMany( () => ApproveStock, (approveStock) => approveStock.sale)
    approveStock: ApproveStock;
}
