import { AllPart } from "src/all-parts/entities/all-part.entity";
import { Model } from "src/models/entities/model.entity";
import { StockPart } from "src/stock-parts/entities/stock-part.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reference {
    @PrimaryGeneratedColumn()
    id : number;
    
    @Column({ unique: true })
    materialCode: string;

    @Column()
    description: string;

    @OneToMany( () => StockPart, stockPart => stockPart.reference)
    stockPart : StockPart[];

    @ManyToMany( () => Model, (model) => model.reference, { cascade : true})
    @JoinTable()
    model : Model[];

    @ManyToOne( () => AllPart, (allpart) => allpart.reference)
    allpart : AllPart
        
}
