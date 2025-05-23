import { Branch } from 'src/branches/entities/branch.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { OutputList } from 'src/output-list/entities/output-list.entity';
import { Permission } from 'src/permission/entities/permission.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { ChildEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, TableInheritance, Unique } from 'typeorm';

@Entity()

export class User {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name : string;

    @Column()
    phone : number;

    @Column()
    password : string;

    @Column()
    createdDate : Date;

    @Column()
    status : string;
    
    @Column({ unique: true })
    login : string;

    @Column("simple-array", { nullable: true })
    role: string[]; 


    @ManyToOne (() => Branch,(branch) => branch.user)
    branch:Branch;
 

    @OneToMany( () => Repair,(repair) => repair.user)
    repair : Repair[]; 

    @OneToMany( () => Tracability, (tracability) => tracability.user)
    tracability: Tracability[];

    @OneToMany( () => OutputList, (outputList) => outputList.user)
    outputList : OutputList[];

    @OneToMany( () => Invoice, (invoice) => invoice.user)
    invoice: Invoice[];
    
    @OneToMany( () => Sale, (sale) => sale.user)
    sale: Sale[];

    @Column({nullable: true, default: null, type: 'varchar'})
    refreshToken: string | null

   
}
