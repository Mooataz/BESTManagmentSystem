import { Invoice } from "src/invoice/entities/invoice.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OtherCost {
    @PrimaryGeneratedColumn()
    id : number;

    @Column('float')
    price: number;

    @Column()
    name : string;

    @ManyToMany( () => Invoice, (invoice) => invoice.otherCost)
    invoice: Invoice; 
}
