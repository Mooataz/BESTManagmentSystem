import { Model } from "src/models/entities/model.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TypeModel {
    @PrimaryGeneratedColumn()
            id : number;
    @Column()
        description : string;

    @OneToMany( () => Model, Model => Model.typeModel)
     model : Model[]
}
