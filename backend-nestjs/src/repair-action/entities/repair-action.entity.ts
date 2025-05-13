import { Repair } from "src/repair/entities/repair.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RepairAction {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name: string;

    @ManyToMany(() => Repair, (repair) => repair.repairAction)
    repair: Repair[];
}
