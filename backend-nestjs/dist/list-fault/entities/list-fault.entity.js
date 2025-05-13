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
exports.ListFault = void 0;
const repair_entity_1 = require("../../repair/entities/repair.entity");
const typeorm_1 = require("typeorm");
let ListFault = class ListFault {
    id;
    name;
    repair;
};
exports.ListFault = ListFault;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ListFault.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ListFault.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => repair_entity_1.Repair, (repair) => repair.listFault),
    __metadata("design:type", Array)
], ListFault.prototype, "repair", void 0);
exports.ListFault = ListFault = __decorate([
    (0, typeorm_1.Entity)()
], ListFault);
//# sourceMappingURL=list-fault.entity.js.map