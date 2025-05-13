import { LevelRepair } from "src/level-repair/entities/level-repair.entity";
import { Model } from "src/models/entities/model.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    name: string;

    @Column({ nullable: true })
    logo: string;

    @Column()
    status : string;

    @OneToMany ( () => Model, Model => Model.brand)
    Model : Model

    @ManyToMany( () => LevelRepair, (levelRepair) => levelRepair.brand)
    @JoinTable()
    levelRepair: LevelRepair;
}
