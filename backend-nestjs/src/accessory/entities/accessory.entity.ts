import { Repair } from "src/repair/entities/repair.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()

export class Accessory {
    @PrimaryGeneratedColumn()
        id : number;
    @Column()
        name : string;

    @ManyToMany ( () => Repair, (repair) => repair.accessory)
    repair : Repair[];
}

