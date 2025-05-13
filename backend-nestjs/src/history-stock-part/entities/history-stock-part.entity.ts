import { StockPart } from "src/stock-parts/entities/stock-part.entity";
import { Tracability } from "src/tracability/entities/tracability.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class HistoryStockPart {
    @PrimaryGeneratedColumn()
        id: number;
    
        @Column()
        date: Date;
    
        @Column()
        step: string;
    
        @ManyToOne( () => StockPart, (stockPart) => stockPart.historyStockPart)
        stockPart : StockPart;
    
        @OneToMany( () => Tracability, (tracability) => tracability.historyStockPart)
        tracability : Tracability[];
}
