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
exports.User = void 0;
const branch_entity_1 = require("../../branches/entities/branch.entity");
const invoice_entity_1 = require("../../invoice/entities/invoice.entity");
const output_list_entity_1 = require("../../output-list/entities/output-list.entity");
const permission_entity_1 = require("../../permission/entities/permission.entity");
const repair_entity_1 = require("../../repair/entities/repair.entity");
const sale_entity_1 = require("../../sales/entities/sale.entity");
const tracability_entity_1 = require("../../tracability/entities/tracability.entity");
const typeorm_1 = require("typeorm");
let User = class User {
    id;
    name;
    phone;
    password;
    createdDate;
    status;
    login;
    role;
    branch;
    permissions;
    repair;
    tracability;
    outputList;
    invoice;
    sale;
    refreshToken;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], User.prototype, "createdDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "login", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch, (branch) => branch.user),
    __metadata("design:type", branch_entity_1.Branch)
], User.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => permission_entity_1.Permission, (permission) => permission.user, { cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], User.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => repair_entity_1.Repair, (repair) => repair.user),
    __metadata("design:type", Array)
], User.prototype, "repair", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tracability_entity_1.Tracability, (tracability) => tracability.user),
    __metadata("design:type", Array)
], User.prototype, "tracability", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => output_list_entity_1.OutputList, (outputList) => outputList.user),
    __metadata("design:type", Array)
], User.prototype, "outputList", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoice_entity_1.Invoice, (invoice) => invoice.user),
    __metadata("design:type", Array)
], User.prototype, "invoice", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sale_entity_1.Sale, (sale) => sale.user),
    __metadata("design:type", Array)
], User.prototype, "sale", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: null, type: 'varchar' }),
    __metadata("design:type", Object)
], User.prototype, "refreshToken", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map