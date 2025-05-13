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
exports.Transfert = void 0;
const repair_entity_1 = require("../../repair/entities/repair.entity");
const stock_part_entity_1 = require("../../stock-parts/entities/stock-part.entity");
const typeorm_1 = require("typeorm");
let Transfert = class Transfert {
    id;
    delivredBy;
    sendingDate;
    fromBranch;
    sendUser;
    receivedDate;
    toBranch;
    receiveUser;
    type;
    state;
    remark;
    repair;
    stockPart;
};
exports.Transfert = Transfert;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Transfert.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transfert.prototype, "delivredBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Transfert.prototype, "sendingDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transfert.prototype, "fromBranch", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transfert.prototype, "sendUser", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Transfert.prototype, "receivedDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transfert.prototype, "toBranch", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transfert.prototype, "receiveUser", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transfert.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transfert.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transfert.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => repair_entity_1.Repair, (repair) => repair.transfert, { cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Transfert.prototype, "repair", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => stock_part_entity_1.StockPart, (stockPart) => stockPart.transfert, { cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Transfert.prototype, "stockPart", void 0);
exports.Transfert = Transfert = __decorate([
    (0, typeorm_1.Entity)()
], Transfert);
//# sourceMappingURL=transfert.entity.js.map