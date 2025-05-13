"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransfertModule = void 0;
const common_1 = require("@nestjs/common");
const transfert_service_1 = require("./transfert.service");
const transfert_controller_1 = require("./transfert.controller");
const typeorm_1 = require("@nestjs/typeorm");
const transfert_entity_1 = require("./entities/transfert.entity");
const stock_part_entity_1 = require("../stock-parts/entities/stock-part.entity");
const repair_entity_1 = require("../repair/entities/repair.entity");
let TransfertModule = class TransfertModule {
};
exports.TransfertModule = TransfertModule;
exports.TransfertModule = TransfertModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([transfert_entity_1.Transfert, stock_part_entity_1.StockPart, repair_entity_1.Repair])],
        controllers: [transfert_controller_1.TransfertController],
        providers: [transfert_service_1.TransfertService],
    })
], TransfertModule);
//# sourceMappingURL=transfert.module.js.map