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
exports.OutputList = void 0;
const customer_entity_1 = require("../../customers/entities/customer.entity");
const repair_entity_1 = require("../../repair/entities/repair.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
let OutputList = class OutputList {
    id;
    date;
    remark;
    repair;
    customer;
    user;
};
exports.OutputList = OutputList;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OutputList.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], OutputList.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OutputList.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => repair_entity_1.Repair, (repair) => repair.outputList),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], OutputList.prototype, "repair", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.outputList),
    __metadata("design:type", customer_entity_1.Customer)
], OutputList.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.outputList),
    __metadata("design:type", user_entity_1.User)
], OutputList.prototype, "user", void 0);
exports.OutputList = OutputList = __decorate([
    (0, typeorm_1.Entity)()
], OutputList);
//# sourceMappingURL=output-list.entity.js.map