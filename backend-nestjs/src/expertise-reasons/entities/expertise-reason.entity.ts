import { Repair } from "src/repair/entities/repair.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()

export class ExpertiseReason {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name: string;

    @ManyToMany(() => Repair, (repair) => repair.expertiseReason)
    repair: Repair[];
}
