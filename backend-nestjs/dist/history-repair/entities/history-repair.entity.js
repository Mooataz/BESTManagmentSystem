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
exports.HistoryRepair = void 0;
const repair_entity_1 = require("../../repair/entities/repair.entity");
const tracability_entity_1 = require("../../tracability/entities/tracability.entity");
const typeorm_1 = require("typeorm");
let HistoryRepair = class HistoryRepair {
    id;
    date;
    step;
    repair;
    tracability;
};
exports.HistoryRepair = HistoryRepair;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HistoryRepair.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], HistoryRepair.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HistoryRepair.prototype, "step", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => repair_entity_1.Repair, (repair) => repair.historyRepair),
    __metadata("design:type", repair_entity_1.Repair)
], HistoryRepair.prototype, "repair", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tracability_entity_1.Tracability, (tracability) => tracability.historyRepair),
    __metadata("design:type", Array)
], HistoryRepair.prototype, "tracability", void 0);
exports.HistoryRepair = HistoryRepair = __decorate([
    (0, typeorm_1.Entity)()
], HistoryRepair);
//# sourceMappingURL=history-repair.entity.js.map