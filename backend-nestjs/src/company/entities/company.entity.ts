import { Branch } from "src/branches/entities/branch.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Company {
        @PrimaryGeneratedColumn()
        id: number;

        @Column()
        name: string;
    
        @Column()
        headquarterslocation: string;
    
        @Column({unique:true})
        taxRegisterNumber: string;
    
        @Column({ type: 'bigint' })
        rib: Number;

        @Column()
        bank : string;
    
        @Column({ nullable: true })
        logo: string;

        @Column()
        quantityAlertStock: number;

        @OneToMany(() => Branch,Branch => Branch.company)
        branches:Branch[]
}
