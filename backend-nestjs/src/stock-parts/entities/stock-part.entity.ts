import { ApproveStock } from "src/approve-stock/entities/approve-stock.entity";
import { Bin } from "src/bin/entities/bin.entity";
import { HistoryStockPart } from "src/history-stock-part/entities/history-stock-part.entity";
import { Reference } from "src/references/entities/reference.entity";
import { Tracability } from "src/tracability/entities/tracability.entity";
import { Transfert } from "src/transfert/entities/transfert.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class StockPart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    remark: string;

    @Column()
    serialNumber: string;

    @ManyToOne( () => Bin, bin => bin.stockPart)
    bin: Bin;

    @ManyToOne( () =>Reference, reference => reference.stockPart)
    reference : Reference;

    @OneToMany( () => HistoryStockPart, historyStockPart => historyStockPart.stockPart)
    historyStockPart : HistoryStockPart[];

    @OneToOne( () => ApproveStock, (approveStock) => approveStock.stockPart)
    approveStock : ApproveStock;

    @ManyToMany(() => Transfert, (transfert) => transfert.stockPart)
    transfert: Transfert;

}
