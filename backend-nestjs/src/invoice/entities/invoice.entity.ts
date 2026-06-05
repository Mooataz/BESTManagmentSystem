import { OtherCost } from "src/other-cost/entities/other-cost.entity";
import { Repair } from "src/repair/entities/repair.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    id! : number;

    @Column({ nullable: true })
    paymentMethod?: string;

    @Column()
    date!: Date;

    @Column()
    state!: string;

    @Column({ type: 'float', nullable: true })
    totalPrice?: number;

    @Column({ type: 'float', nullable: true })
    tva?: number;

    @Column({ type: 'float', nullable: true })
    timbreFiscale?: number;

    @Column({ type: 'float', nullable: true })
    partsTotal?: number;

    @Column({ type: 'float', nullable: true })
    levelRepairPrice?: number;

    @Column({ type: 'float', nullable: true })
    otherCostsTotal?: number;

    @Column('jsonb', { nullable: true })
    details?: object;

    @ManyToMany( () => OtherCost, (otherCost) => otherCost.invoice)
    @JoinTable()
    otherCost? : OtherCost[]; 

    @OneToOne( () => Repair, (repair) => repair.invoice, {nullable: true} )
    @JoinColumn()
    repair!: Repair;

    @ManyToOne( () => User, (user) => user.invoice)
    user!: User;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'validated_by' })
    validatedBy?: User;

    @Column({ type: 'timestamptz', nullable: true })
    validatedAt?: Date;
}
