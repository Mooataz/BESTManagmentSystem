import { Branch } from "src/branches/entities/branch.entity";
import { StockPart } from "src/stock-parts/entities/stock-part.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bin {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({ unique: true })
    name: string;

    @Column()
    type: string;

    @ManyToOne( () => Branch, branch => branch.bin)
    branch : Branch;

    @OneToMany( () => StockPart, stockPart => stockPart.bin)
    stockPart : StockPart[];
}
