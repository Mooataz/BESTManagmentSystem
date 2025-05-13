import { Repair } from "src/repair/entities/repair.entity";
import { Sale } from "src/sales/entities/sale.entity";
import { StockPart } from "src/stock-parts/entities/stock-part.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ApproveStock {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column({ type: 'timestamptz' })
    date: Date;

    @Column()
    state: string;

    @Column()
    idPartRepair: number;

    @ManyToOne( () => Repair, repair => repair.approveStock)
    repair : Repair; 

    @OneToOne( () => StockPart, (stockPart) => stockPart.approveStock)
    @JoinColumn()
    stockPart : StockPart;

    @ManyToOne( () => Sale, (sale) => sale.approveStock)
    sale: Sale;
}
