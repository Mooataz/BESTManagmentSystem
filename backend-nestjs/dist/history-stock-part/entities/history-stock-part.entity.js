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
exports.HistoryStockPart = void 0;
const stock_part_entity_1 = require("../../stock-parts/entities/stock-part.entity");
const tracability_entity_1 = require("../../tracability/entities/tracability.entity");
const typeorm_1 = require("typeorm");
let HistoryStockPart = class HistoryStockPart {
    id;
    date;
    step;
    stockPart;
    tracability;
};
exports.HistoryStockPart = HistoryStockPart;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HistoryStockPart.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], HistoryStockPart.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HistoryStockPart.prototype, "step", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_part_entity_1.StockPart, (stockPart) => stockPart.historyStockPart),
    __metadata("design:type", stock_part_entity_1.StockPart)
], HistoryStockPart.prototype, "stockPart", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tracability_entity_1.Tracability, (tracability) => tracability.historyStockPart),
    __metadata("design:type", Array)
], HistoryStockPart.prototype, "tracability", void 0);
exports.HistoryStockPart = HistoryStockPart = __decorate([
    (0, typeorm_1.Entity)()
], HistoryStockPart);
//# sourceMappingURL=history-stock-part.entity.js.map