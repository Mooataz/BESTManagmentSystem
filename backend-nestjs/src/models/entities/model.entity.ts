import { AllPart } from "src/all-parts/entities/all-part.entity";
import { Brand } from "src/brands/entities/brand.entity";
import { Device } from "src/devices/entities/device.entity";
import { PartsPrice } from "src/parts-price/entities/parts-price.entity";
import { Reference } from "src/references/entities/reference.entity";
import { Repair } from "src/repair/entities/repair.entity";
import { TypeModel } from "src/type-model/entities/type-model.entity";

import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Model {
    @PrimaryGeneratedColumn()
            id: number;

    @Column()
            name: string;
            
    @Column({ nullable: true })
            picture: string;

    @ManyToOne( () => Brand, Brand => Brand.Model,  { cascade: true })
    brand : Brand 

    @ManyToOne( () => TypeModel, typeModel => typeModel.model,  { cascade: true })
    typeModel : TypeModel ;

    @OneToMany( () => Device, device => device.model)
    device :Device[];

    @ManyToMany( () => Reference, reference => reference.model)
    reference : Reference;

    @ManyToMany( () => AllPart, (allpart) => allpart.model, { cascade: true })
    @JoinTable()
    allpart : AllPart[];

    @OneToMany( () => PartsPrice, (partPrice) => partPrice.model )
    partsPrice : PartsPrice[];

}
