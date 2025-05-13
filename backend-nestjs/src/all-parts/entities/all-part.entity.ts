import { Model } from "src/models/entities/model.entity";
import { PartsPrice } from "src/parts-price/entities/parts-price.entity";
import { Reference } from "src/references/entities/reference.entity";
import { Sale } from "src/sales/entities/sale.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AllPart {
    @PrimaryGeneratedColumn()
        id : number;
    @Column()
        description : string;

    @ManyToMany( () => Model, (model) => model.allpart)
    model : Model[]

    @OneToMany( () => Reference, (reference) => reference.allpart)
    reference : Reference[];

    @OneToMany( () => PartsPrice, (partsPrice) => partsPrice.allPart)
    partsPrice : PartsPrice[];
    
    @ManyToMany( () => Sale, (sale) => sale.allPart)
    sale: Sale[];
}
