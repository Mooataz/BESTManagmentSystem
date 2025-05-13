import { Repair } from "src/repair/entities/repair.entity";
import { StockPart } from "src/stock-parts/entities/stock-part.entity";
import { Tracability } from "src/tracability/entities/tracability.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transfert {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    delivredBy: string;

    @Column()
    sendingDate: Date;
    
    @Column()
    fromBranch: number;

    @Column()
    sendUser: number;

    @Column()
    receivedDate: Date;

    @Column()
    toBranch: number;

    @Column()
    receiveUser: number;

    @Column()
    type: string;

    @Column()
    state: string;

    @Column()
    remark: string;

    @ManyToMany(() => Repair, (repair) => repair.transfert, { cascade: true })
    @JoinTable()
    repair: Repair[];

    @ManyToMany(() => StockPart, (stockPart) => stockPart.transfert, { cascade: true })
    @JoinTable()
    stockPart: StockPart[];

}
