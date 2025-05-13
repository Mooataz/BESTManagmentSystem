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
exports.StockPart = void 0;
const approve_stock_entity_1 = require("../../approve-stock/entities/approve-stock.entity");
const bin_entity_1 = require("../../bin/entities/bin.entity");
const history_stock_part_entity_1 = require("../../history-stock-part/entities/history-stock-part.entity");
const reference_entity_1 = require("../../references/entities/reference.entity");
const transfert_entity_1 = require("../../transfert/entities/transfert.entity");
const typeorm_1 = require("typeorm");
let StockPart = class StockPart {
    id;
    remark;
    serialNumber;
    bin;
    reference;
    historyStockPart;
    approveStock;
    transfert;
};
exports.StockPart = StockPart;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockPart.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockPart.prototype, "remark", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockPart.prototype, "serialNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bin_entity_1.Bin, bin => bin.stockPart),
    __metadata("design:type", bin_entity_1.Bin)
], StockPart.prototype, "bin", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reference_entity_1.Reference, reference => reference.stockPart),
    __metadata("design:type", reference_entity_1.Reference)
], StockPart.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => history_stock_part_entity_1.HistoryStockPart, historyStockPart => historyStockPart.stockPart),
    __metadata("design:type", Array)
], StockPart.prototype, "historyStockPart", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => approve_stock_entity_1.ApproveStock, (approveStock) => approveStock.stockPart),
    __metadata("design:type", approve_stock_entity_1.ApproveStock)
], StockPart.prototype, "approveStock", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => transfert_entity_1.Transfert, (transfert) => transfert.stockPart),
    __metadata("design:type", transfert_entity_1.Transfert)
], StockPart.prototype, "transfert", void 0);
exports.StockPart = StockPart = __decorate([
    (0, typeorm_1.Entity)()
], StockPart);
//# sourceMappingURL=stock-part.entity.js.map