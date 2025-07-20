import { Repair } from "src/repair/entities/repair.entity";
import { StockPart } from "src/stock-parts/entities/stock-part.entity";
import { Tracability } from "src/tracability/entities/tracability.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transfert {
    @PrimaryGeneratedColumn() id: number;

    @Column({ nullable: true }) delivredBy: string;

    
    @Column() sendingDate: Date;
    
    @Column() frombranch: number;

    @Column() sendUser: number;

    
    @Column({ nullable: true }) receivedDate: Date;

    @Column() tobranch: number;

    @Column({ nullable: true }) receiveUser: number;

    
    @Column() type: string;

    @Column({ nullable: true }) state: string;

    @Column({ nullable: true }) remark: string;
    
    @Column({ nullable: true }) typePart:string;

    @ManyToMany(() => Repair, (repair) => repair.transfert, { cascade: true })
    @JoinTable()
    repair: Repair[];

    @ManyToMany(() => StockPart, (stockPart) => stockPart.transfert, { cascade: true })
    @JoinTable()
    stockPart: StockPart[];

}
