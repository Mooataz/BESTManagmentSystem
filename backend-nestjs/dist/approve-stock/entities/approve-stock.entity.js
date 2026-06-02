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
exports.ApproveStock = void 0;
const repair_entity_1 = require("../../repair/entities/repair.entity");
const sale_entity_1 = require("../../sales/entities/sale.entity");
const stock_part_entity_1 = require("../../stock-parts/entities/stock-part.entity");
const typeorm_1 = require("typeorm");
let ApproveStock = class ApproveStock {
    id;
    type;
    date;
    state;
    idPartRepair;
    repair;
    stockPart;
    sale;
};
exports.ApproveStock = ApproveStock;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ApproveStock.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ApproveStock.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ApproveStock.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ApproveStock.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ApproveStock.prototype, "idPartRepair", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => repair_entity_1.Repair, repair => repair.approveStock),
    __metadata("design:type", repair_entity_1.Repair)
], ApproveStock.prototype, "repair", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => stock_part_entity_1.StockPart, (stockPart) => stockPart.approveStock),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", stock_part_entity_1.StockPart)
], ApproveStock.prototype, "stockPart", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sale_entity_1.Sale, (sale) => sale.approveStock),
    __metadata("design:type", sale_entity_1.Sale)
], ApproveStock.prototype, "sale", void 0);
exports.ApproveStock = ApproveStock = __decorate([
    (0, typeorm_1.Entity)()
], ApproveStock);
//# sourceMappingURL=approve-stock.entity.js.map