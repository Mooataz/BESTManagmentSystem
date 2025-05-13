"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryStockPartModule = void 0;
const common_1 = require("@nestjs/common");
const history_stock_part_service_1 = require("./history-stock-part.service");
const history_stock_part_controller_1 = require("./history-stock-part.controller");
const typeorm_1 = require("@nestjs/typeorm");
const history_stock_part_entity_1 = require("./entities/history-stock-part.entity");
let HistoryStockPartModule = class HistoryStockPartModule {
};
exports.HistoryStockPartModule = HistoryStockPartModule;
exports.HistoryStockPartModule = HistoryStockPartModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([history_stock_part_entity_1.HistoryStockPart])],
        controllers: [history_stock_part_controller_1.HistoryStockPartController],
        providers: [history_stock_part_service_1.HistoryStockPartService],
    })
], HistoryStockPartModule);
//# sourceMappingURL=history-stock-part.module.js.map