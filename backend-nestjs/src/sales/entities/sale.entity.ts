import { AllPart } from "src/all-parts/entities/all-part.entity";
import { ApproveStock } from "src/approve-stock/entities/approve-stock.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sale {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    state?: string;

    @Column('float', { nullable: true })
    totalPrice?: number;

    @Column()
    date?: Date;

    @Column('jsonb', { nullable: true })
    details?: object;

    @ManyToOne( () => User, (user) => user.sale)
    user?: User;

    @ManyToMany( () => AllPart, (allPart) => allPart.sale)
    @JoinTable()
    allPart?: AllPart[];

    @OneToMany( () => ApproveStock, (approveStock) => approveStock.sale)
    approveStock?: ApproveStock;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'validated_by' })
    validatedBy?: User;

    @Column({ type: 'timestamptz', nullable: true })
    validatedAt?: Date;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'confirmed_by' })
    confirmedBy?: User;

    @Column({ type: 'timestamptz', nullable: true })
    confirmedAt?: Date;

    @ManyToOne(() => Customer, (customer) => customer.sale, { nullable: true })
    @JoinColumn({ name: 'customer_id' })
    customer?: Customer;
}
