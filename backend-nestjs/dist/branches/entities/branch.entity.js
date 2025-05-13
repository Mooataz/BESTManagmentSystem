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
exports.Branch = void 0;
const bin_entity_1 = require("../../bin/entities/bin.entity");
const company_entity_1 = require("../../company/entities/company.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
let Branch = class Branch {
    id;
    name;
    location;
    phone;
    email;
    company;
    user;
    bin;
};
exports.Branch = Branch;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Branch.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Branch.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Branch.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Branch.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Branch.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, Company => Company.branches),
    __metadata("design:type", company_entity_1.Company)
], Branch.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, user => user.branch),
    __metadata("design:type", Array)
], Branch.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bin_entity_1.Bin, bin => bin.branch),
    __metadata("design:type", Array)
], Branch.prototype, "bin", void 0);
exports.Branch = Branch = __decorate([
    (0, typeorm_1.Entity)()
], Branch);
//# sourceMappingURL=branch.entity.js.map