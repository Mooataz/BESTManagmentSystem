import { AllPart } from "src/all-parts/entities/all-part.entity";
import { LevelRepair } from "src/level-repair/entities/level-repair.entity";
import { Model } from "src/models/entities/model.entity";
import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique( ['allPart','model'])
export class PartsPrice {
    @PrimaryGeneratedColumn()
    id : number;

    @Column('float')
    price: number;

    @ManyToOne( () => Model, (model) => model.partsPrice)
    model : Model;

    @ManyToOne( () => AllPart, (allPart) => allPart.partsPrice)
    allPart : AllPart;

    @ManyToOne ( () => LevelRepair, (levelRepair) => levelRepair.partsPrice)
    levelRepair: LevelRepair;
}
