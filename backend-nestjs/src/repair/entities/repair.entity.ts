import { Accessory } from "src/accessory/entities/accessory.entity";
import { ApproveStock } from "src/approve-stock/entities/approve-stock.entity";
import { CustomerRequest } from "src/customer-request/entities/customer-request.entity";
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
    
    @Column({ type: 'boolean', default: false })
    warrenty?: boolean;

    @Column({ type: 'boolean', default: false })
    approveRepair?: boolean;

    @Column()
    newSerialNumber?: string;

    @Column()
    advancePayment?: number;

    @Column()
    actuellyBranch: number;

    @Column('jsonb', { nullable: true })
    files?: string[]; 

    @Column("simple-array", { nullable: true})
    partsNeed?: number[] ;

    @Column()
    remark?: string;

    @Column()
    deviceStateReceive: string;

    @ManyToMany ( () => Accessory, (accessory) =>accessory.repair , { cascade : true})
    @JoinTable()
    accessory? : Accessory[];
    
    @ManyToMany ( () => ListFault, (listFault) =>listFault.repair , { cascade : true})
    @JoinTable()
    listFault : ListFault[];

    @ManyToMany ( () => CustomerRequest, (customerRequest) =>customerRequest.repair , { cascade : true})
    @JoinTable()
    customerRequest? : CustomerRequest[];

    @ManyToMany ( () => NotesCustomer, (notesCustomer) =>notesCustomer.repair , { cascade : true})
    @JoinTable()
    notesCustomer? : NotesCustomer[];

    @ManyToMany ( () => ExpertiseReason, (expertiseReason) =>expertiseReason.repair , { cascade : true})
    @JoinTable()
    expertiseReason? : ExpertiseReason[];

    @ManyToMany ( () => RepairAction, (repairAction) =>repairAction.repair , { cascade : true})
    @JoinTable()
    repairAction? : RepairAction[];

    @ManyToOne( () => Device, device => device.repair)
    device :Device;

    @ManyToOne( () => User,user => user.repair)
    user : User;

    @OneToMany( () => ApproveStock, approveStock => approveStock.repair)
    approveStock? : ApproveStock[];

    @OneToMany( () => HistoryRepair, historyRepair => historyRepair.repair)
    historyRepair : HistoryRepair[]; 

    @ManyToOne( () => OutputList, (outputList) => outputList.repair)
    outputList : OutputList;
    
    @ManyToMany( () => Transfert, transfert => transfert.repair)
    transfert : Transfert[]; 

    @OneToOne( () => Invoice, (invoice) => invoice.repair)
    invoice: Invoice;
}
