import { Customer } from "src/customers/entities/customer.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Distributeur {
    
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name: string;
   
    @Column()
    phone : number;
    
    @Column()
    email: string;
    
    @Column()
    location: string;
    
    @Column()
    taxRegisterNumber: string;

    @OneToMany( () => Customer,customer =>customer.distributer)
    customer : Customer[]
}
