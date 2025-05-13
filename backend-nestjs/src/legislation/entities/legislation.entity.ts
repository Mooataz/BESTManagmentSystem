import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Legislation {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name: string;

}
