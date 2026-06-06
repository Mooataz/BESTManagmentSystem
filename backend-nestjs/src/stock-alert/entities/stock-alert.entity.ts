import { Branch } from "src/branches/entities/branch.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StockAlert {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    branchId!: number;

    @ManyToOne(() => Branch, (branch) => branch.stockAlert)
    branch?: Branch;

    @Column({ default: 'stock' })
    type!: string;

    @Column('jsonb')
    report!: Record<string, any>[];

    @Column("simple-array", { nullable: true })
    readBy!: string[];

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    createdAt!: Date;
}
