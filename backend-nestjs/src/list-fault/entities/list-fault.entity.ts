import { Repair } from "src/repair/entities/repair.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class ListFault {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
    
    @ManyToMany(() => Repair, (repair) => repair.listFault)
    repair: Repair[];

}
