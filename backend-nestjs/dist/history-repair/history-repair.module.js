"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryRepairModule = void 0;
const common_1 = require("@nestjs/common");
const history_repair_service_1 = require("./history-repair.service");
const history_repair_controller_1 = require("./history-repair.controller");
const typeorm_1 = require("@nestjs/typeorm");
const history_repair_entity_1 = require("./entities/history-repair.entity");
const repair_entity_1 = require("../repair/entities/repair.entity");
let HistoryRepairModule = class HistoryRepairModule {
};
exports.HistoryRepairModule = HistoryRepairModule;
exports.HistoryRepairModule = HistoryRepairModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([history_repair_entity_1.HistoryRepair, repair_entity_1.Repair])],
        controllers: [history_repair_controller_1.HistoryRepairController],
        providers: [history_repair_service_1.HistoryRepairService],
    })
], HistoryRepairModule);
//# sourceMappingURL=history-repair.module.js.map