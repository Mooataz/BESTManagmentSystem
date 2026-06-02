"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracabilityModule = void 0;
const common_1 = require("@nestjs/common");
const tracability_service_1 = require("./tracability.service");
const tracability_controller_1 = require("./tracability.controller");
const typeorm_1 = require("@nestjs/typeorm");
const tracability_entity_1 = require("./entities/tracability.entity");
const user_entity_1 = require("../users/entities/user.entity");
const history_repair_entity_1 = require("../history-repair/entities/history-repair.entity");
const history_stock_part_entity_1 = require("../history-stock-part/entities/history-stock-part.entity");
let TracabilityModule = class TracabilityModule {
};
exports.TracabilityModule = TracabilityModule;
exports.TracabilityModule = TracabilityModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tracability_entity_1.Tracability, user_entity_1.User, history_repair_entity_1.HistoryRepair, history_stock_part_entity_1.HistoryStockPart])],
        controllers: [tracability_controller_1.TracabilityController],
        providers: [tracability_service_1.TracabilityService],
    })
], TracabilityModule);
//# sourceMappingURL=tracability.module.js.map