import { Bin } from "src/bin/entities/bin.entity";
import { Company } from "src/company/entities/company.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Branch {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    location : string;

    @Column()
    phone : number;

    @Column()
    email  : string;

    @ManyToOne(() => Company,Company =>Company.branches)
    company:Company;
    
    @OneToMany(() =>User,user => user.branch)
    user: User[];

    @OneToMany( () => Bin, bin => bin.branch)
    bin : Bin[];
}
