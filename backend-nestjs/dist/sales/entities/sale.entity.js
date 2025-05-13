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
exports.Sale = void 0;
const all_part_entity_1 = require("../../all-parts/entities/all-part.entity");
const approve_stock_entity_1 = require("../../approve-stock/entities/approve-stock.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
let Sale = class Sale {
    id;
    state;
    totalPrice;
    date;
    user;
    allPart;
    approveStock;
};
exports.Sale = Sale;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Sale.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sale.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], Sale.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Sale.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.sale),
    __metadata("design:type", user_entity_1.User)
], Sale.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => all_part_entity_1.AllPart, (allPart) => allPart.sale),
    __metadata("design:type", Array)
], Sale.prototype, "allPart", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => approve_stock_entity_1.ApproveStock, (approveStock) => approveStock.sale),
    __metadata("design:type", approve_stock_entity_1.ApproveStock)
], Sale.prototype, "approveStock", void 0);
exports.Sale = Sale = __decorate([
    (0, typeorm_1.Entity)()
], Sale);
//# sourceMappingURL=sale.entity.js.map