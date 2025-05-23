import { Customer } from "src/customers/entities/customer.entity";
import { Model } from "src/models/entities/model.entity";
import { Repair } from "src/repair/entities/repair.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Device {
    @PrimaryGeneratedColumn()
        id: number;
    @Column()
        serialenumber : string;
    
    @Column({ type: 'timestamptz' })
        purchaseDate : Date ;
    
    @Column()
        warrentyProof : string;


    @OneToMany( () => Repair, repair => repair.device)
    repair: Repair[];

    @ManyToOne( () => Model, model => model.device)
    model : Model;
}
