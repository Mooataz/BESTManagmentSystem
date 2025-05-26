"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repair = void 0;
const accessory_entity_1 = require("../../accessory/entities/accessory.entity");
const approve_stock_entity_1 = require("../../approve-stock/entities/approve-stock.entity");
const customer_request_entity_1 = require("../../customer-request/entities/customer-request.entity");
const customer_entity_1 = require("../../customers/entities/customer.entity");
const device_entity_1 = require("../../devices/entities/device.entity");
const expertise_reason_entity_1 = require("../../expertise-reasons/entities/expertise-reason.entity");
const history_repair_entity_1 = require("../../history-repair/entities/history-repair.entity");
const invoice_entity_1 = require("../../invoice/entities/invoice.entity");
const list_fault_entity_1 = require("../../list-fault/entities/list-fault.entity");
const notes_customer_entity_1 = require("../../notes-customer/entities/notes-customer.entity");
const output_list_entity_1 = require("../../output-list/entities/output-list.entity");
const repair_action_entity_1 = require("../../repair-action/entities/repair-action.entity");
const transfert_entity_1 = require("../../transfert/entities/transfert.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
let Repair = class Repair {
    id;
    warrenty;
    approveRepair;
    newSerialNumber;
    advancePayment;
    actuellyBranch;
    files;
    partsNeed;
    remark;
    deviceStateReceive;
    accessory;
    listFault;
    customerRequest;
    notesCustomer;
    expertiseReason;
    repairAction;
    device;
    user;
    approveStock;
    historyRepair;
    outputList;
    transfert;
    invoice;
    customer;
};
exports.Repair = Repair;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Repair.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], Repair.prototype, "warrenty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], Repair.prototype, "approveRepair", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Repair.prototype, "newSerialNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Repair.prototype, "advancePayment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Repair.prototype, "actuellyBranch", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Array)
], Repair.prototype, "files", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], Repair.prototype, "partsNeed", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Repair.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Repair.prototype, "deviceStateReceive", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => accessory_entity_1.Accessory, (accessory) => accessory.repair, { cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Repair.prototype, "accessory", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => list_fault_entity_1.ListFault, (listFault) => listFault.repair, { cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Repair.prototype, "listFault", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => customer_request_entity_1.CustomerRequest, (customerRequest) => customerRequest.repair, { cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Repair.prototype, "customerRequest", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => notes_customer_entity_1.NotesCustomer, (notesCustomer) => notesCustomer.repair, { cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Repair.prototype, "notesCustomer", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => expertise_reason_entity_1.ExpertiseReason, (expertiseReason) => expertiseReason.repair, { cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Repair.prototype, "expertiseReason", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => repair_action_entity_1.RepairAction, (repairAction) => repairAction.repair, { cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Repair.prototype, "repairAction", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_entity_1.Device, device => device.repair),
    __metadata("design:type", device_entity_1.Device)
], Repair.prototype, "device", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.repair),
    __metadata("design:type", user_entity_1.User)
], Repair.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => approve_stock_entity_1.ApproveStock, approveStock => approveStock.repair),
    __metadata("design:type", Array)
], Repair.prototype, "approveStock", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => history_repair_entity_1.HistoryRepair, historyRepair => historyRepair.repair),
    __metadata("design:type", Array)
], Repair.prototype, "historyRepair", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => output_list_entity_1.OutputList, (outputList) => outputList.repair),
    __metadata("design:type", output_list_entity_1.OutputList)
], Repair.prototype, "outputList", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => transfert_entity_1.Transfert, transfert => transfert.repair),
    __metadata("design:type", Array)
], Repair.prototype, "transfert", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => invoice_entity_1.Invoice, (invoice) => invoice.repair),
    __metadata("design:type", invoice_entity_1.Invoice)
], Repair.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, customer => customer.repair),
    __metadata("design:type", customer_entity_1.Customer)
], Repair.prototype, "customer", void 0);
exports.Repair = Repair = __decorate([
    (0, typeorm_1.Entity)()
], Repair);
//# sourceMappingURL=repair.entity.js.map