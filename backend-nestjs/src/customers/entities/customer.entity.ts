import { Device } from "src/devices/entities/device.entity";
import { Distributeur } from "src/distributeur/entities/distributeur.entity";
import { OutputList } from "src/output-list/entities/output-list.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Customer {
        @PrimaryGeneratedColumn()
        id: number;

        @Column({unique:true})
        name: string;
 
        @Column()
        phone: number;
    
       @ManyToOne( () => Distributeur, distributer => distributer.customer)
       distributer : Distributeur;
        
       @ManyToMany( () => Device, device => device.customer)
       device : Device[];

       @OneToMany( () => OutputList, (outputList) => outputList.customer)
       outputList : OutputList[];
}
