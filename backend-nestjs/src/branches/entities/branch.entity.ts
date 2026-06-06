import { Bin } from "src/bin/entities/bin.entity";
import { Company } from "src/company/entities/company.entity";
import { Notification } from "src/notification/Entity/notification.entity";
import { StockAlert } from "src/stock-alert/entities/stock-alert.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Branch {
    @PrimaryGeneratedColumn()
    id! : number;

    @Column()
    name? : string;

    @Column()
    location? : string;

    @Column()
    phone? : number;

    @Column()
    email?  : string;

    @ManyToOne(() => Company,Company =>Company.branches)
    company?:Company;
    
    @OneToMany(() =>User,user => user.branch)
    user?: User[];

    @OneToMany( () => Bin, bin => bin.branch)
    bin? : Bin[];

    @OneToMany(() => StockAlert, (stockAlert) => stockAlert.branch)
    stockAlert?: StockAlert[];

    @OneToMany(() => Notification, (notification) => notification.branch)
    notification?: Notification[];
}
