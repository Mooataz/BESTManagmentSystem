import { HistoryRepair } from "src/history-repair/entities/history-repair.entity";
import { HistoryStockPart } from "src/history-stock-part/entities/history-stock-part.entity";
import { User } from "src/users/entities/user.entity";
import {  Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tracability {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne( () => HistoryRepair, (historyRepair) => historyRepair.repair, {cascade: true, eager: true })
    historyRepair : HistoryRepair;

    @ManyToOne( () => HistoryStockPart, (historyStockPart) => historyStockPart.tracability)
    historyStockPart : HistoryStockPart;

    @ManyToOne( () => User, user => user.tracability)
    user : User;

    
}
