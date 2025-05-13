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
exports.Customer = void 0;
const device_entity_1 = require("../../devices/entities/device.entity");
const distributeur_entity_1 = require("../../distributeur/entities/distributeur.entity");
const output_list_entity_1 = require("../../output-list/entities/output-list.entity");
const typeorm_1 = require("typeorm");
let Customer = class Customer {
    id;
    name;
    phone;
    distributer;
    device;
    outputList;
};
exports.Customer = Customer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Customer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => distributeur_entity_1.Distributeur, distributer => distributer.customer),
    __metadata("design:type", distributeur_entity_1.Distributeur)
], Customer.prototype, "distributer", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => device_entity_1.Device, device => device.customer),
    __metadata("design:type", Array)
], Customer.prototype, "device", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => output_list_entity_1.OutputList, (outputList) => outputList.customer),
    __metadata("design:type", Array)
], Customer.prototype, "outputList", void 0);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)()
], Customer);
//# sourceMappingURL=customer.entity.js.map