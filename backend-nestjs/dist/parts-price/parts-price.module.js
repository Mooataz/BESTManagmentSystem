"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartsPriceModule = void 0;
const common_1 = require("@nestjs/common");
const parts_price_service_1 = require("./parts-price.service");
const parts_price_controller_1 = require("./parts-price.controller");
const typeorm_1 = require("@nestjs/typeorm");
const parts_price_entity_1 = require("./entities/parts-price.entity");
const all_part_entity_1 = require("../all-parts/entities/all-part.entity");
const model_entity_1 = require("../models/entities/model.entity");
const level_repair_entity_1 = require("../level-repair/entities/level-repair.entity");
let PartsPriceModule = class PartsPriceModule {
};
exports.PartsPriceModule = PartsPriceModule;
exports.PartsPriceModule = PartsPriceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([parts_price_entity_1.PartsPrice, all_part_entity_1.AllPart, model_entity_1.Model, level_repair_entity_1.LevelRepair])],
        controllers: [parts_price_controller_1.PartsPriceController],
        providers: [parts_price_service_1.PartsPriceService],
    })
], PartsPriceModule);
//# sourceMappingURL=parts-price.module.js.map