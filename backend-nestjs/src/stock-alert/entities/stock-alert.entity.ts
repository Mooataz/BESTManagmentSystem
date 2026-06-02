import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StockAlert {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    branchId!: number;

    @Column({ default: 'stock' })
    type!: string;

    @Column('jsonb')
    report!: Record<string, any>[];

    @Column("simple-array", { nullable: true })
    readBy!: string[];

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    createdAt!: Date;
}
