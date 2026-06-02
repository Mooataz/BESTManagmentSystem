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
exports.Tracability = void 0;
const history_repair_entity_1 = require("../../history-repair/entities/history-repair.entity");
const history_stock_part_entity_1 = require("../../history-stock-part/entities/history-stock-part.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
let Tracability = class Tracability {
    id;
    historyRepair;
    historyStockPart;
    user;
};
exports.Tracability = Tracability;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Tracability.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => history_repair_entity_1.HistoryRepair, (historyRepair) => historyRepair.repair, { cascade: true, eager: true, nullable: true }),
    __metadata("design:type", history_repair_entity_1.HistoryRepair)
], Tracability.prototype, "historyRepair", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => history_stock_part_entity_1.HistoryStockPart, (historyStockPart) => historyStockPart.tracability, { nullable: true }),
    __metadata("design:type", history_stock_part_entity_1.HistoryStockPart)
], Tracability.prototype, "historyStockPart", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.tracability),
    __metadata("design:type", user_entity_1.User)
], Tracability.prototype, "user", void 0);
exports.Tracability = Tracability = __decorate([
    (0, typeorm_1.Entity)()
], Tracability);
//# sourceMappingURL=tracability.entity.js.map