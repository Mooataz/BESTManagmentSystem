import { Repair } from "src/repair/entities/repair.entity";
import { Tracability } from "src/tracability/entities/tracability.entity";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class HistoryRepair {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column()
    step: string;

    @ManyToOne( () => Repair, (repair) => repair.historyRepair)
    repair : Repair;

    @OneToMany( () => Tracability, (tracability) => tracability.historyRepair)
    tracability : Tracability[];
}
