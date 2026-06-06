import { Company } from "src/company/entities/company.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Legislation {

    @PrimaryGeneratedColumn()
    id! : number;

    @Column()
    name!: string;

    @ManyToOne(() => Company, (company) => company.legislation, { nullable: true })
    company?: Company;
}
