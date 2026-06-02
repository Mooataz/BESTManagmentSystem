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
exports.Invoice = void 0;
const other_cost_entity_1 = require("../../other-cost/entities/other-cost.entity");
const repair_entity_1 = require("../../repair/entities/repair.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
let Invoice = class Invoice {
    id;
    paymentMethod;
    date;
    state;
    totalPrice;
    otherCost;
    repair;
    user;
};
exports.Invoice = Invoice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Invoice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Invoice.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Invoice.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Invoice.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Invoice.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => other_cost_entity_1.OtherCost, (otherCost) => otherCost.invoice),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Invoice.prototype, "otherCost", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => repair_entity_1.Repair, (repair) => repair.invoice, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", repair_entity_1.Repair)
], Invoice.prototype, "repair", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.invoice),
    __metadata("design:type", user_entity_1.User)
], Invoice.prototype, "user", void 0);
exports.Invoice = Invoice = __decorate([
    (0, typeorm_1.Entity)()
], Invoice);
//# sourceMappingURL=invoice.entity.js.map