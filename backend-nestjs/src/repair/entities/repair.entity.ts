import { Accessory } from "src/accessory/entities/accessory.entity";
import { ApproveStock } from "src/approve-stock/entities/approve-stock.entity";
import { CustomerRequest } from "src/customer-request/entities/customer-request.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { Device } from "src/devices/entities/device.entity";
import { ExpertiseReason } from "src/expertise-reasons/entities/expertise-reason.entity";
import { HistoryRepair } from "src/history-repair/entities/history-repair.entity";
import { Invoice } from "src/invoice/entities/invoice.entity";
import { ListFault } from "src/list-fault/entities/list-fault.entity";
import { NotesCustomer } from "src/notes-customer/entities/notes-customer.entity";
import { OutputList } from "src/output-list/entities/output-list.entity";
import { RepairAction } from "src/repair-action/entities/repair-action.entity";
import { Tracability } from "src/tracability/entities/tracability.entity";
import { Transfert } from "src/transfert/entities/transfert.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity()

export class Repair {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'boolean', nullable: true  })
    warrenty: boolean;

    @Column({ type: 'boolean', nullable: true })
    approveRepair: boolean;

    @Column({ nullable: true })
    newSerialNumber: string;

   

    @Column()
    actuellybranch: number;

    @Column('jsonb', { nullable: true })
    files: string[]; 

    @Column("simple-array", { nullable: true})
    partsNeed: number[] ;

    @Column({ nullable: true })
    remark: string;

    @Column()
    deviceStateReceive: string;

    @ManyToMany ( () => Accessory, (accessory) =>accessory.repair , { cascade : true, nullable: true }, )
    @JoinTable()
    accessory : Accessory[];
    
    @ManyToMany ( () => ListFault, (listFault) =>listFault.repair , { cascade : true})
    @JoinTable()
    listFault : ListFault[];

    @ManyToMany ( () => CustomerRequest, (customerRequest) =>customerRequest.repair , { cascade : true, nullable: true })
    @JoinTable()
    customerRequest : CustomerRequest[];

    @ManyToMany ( () => NotesCustomer, (notesCustomer) =>notesCustomer.repair , { cascade : true, nullable: true })
    @JoinTable()
    notesCustomer : NotesCustomer[];

    @ManyToMany ( () => ExpertiseReason, (expertiseReason) =>expertiseReason.repair , { cascade : true, nullable: true })
    @JoinTable()
    expertiseReason : ExpertiseReason[];

    @ManyToMany ( () => RepairAction, (repairAction) =>repairAction.repair , { cascade : true, nullable: true })
    @JoinTable()
    repairAction : RepairAction[];

    @ManyToOne( () => Device, device => device.repair)
    device :Device;

    @ManyToOne( () => User,user => user.repair, { nullable: true })
    user : User;

    @OneToMany( () => ApproveStock, approveStock => approveStock.repair, { nullable: true })
    approveStock : ApproveStock[];

    @OneToMany( () => HistoryRepair, historyRepair => historyRepair.repair, { nullable: true })
    historyRepair : HistoryRepair[]; 

    @ManyToOne( () => OutputList, (outputList) => outputList.repair, { nullable: true })
    outputList : OutputList;
    
    @ManyToMany( () => Transfert, transfert => transfert.repair, { nullable: true })
    transfert : Transfert[]; 

    @OneToOne( () => Invoice, (invoice) => invoice.repair, { nullable: true })
    invoice: Invoice;

    @ManyToOne( () => Customer, customer => customer.repair, { nullable: true })
    customer: Customer;
}
