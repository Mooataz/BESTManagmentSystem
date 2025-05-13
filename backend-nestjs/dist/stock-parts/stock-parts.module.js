"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockPartsModule = void 0;
const common_1 = require("@nestjs/common");
const stock_parts_service_1 = require("./stock-parts.service");
const stock_parts_controller_1 = require("./stock-parts.controller");
const typeorm_1 = require("@nestjs/typeorm");
const stock_part_entity_1 = require("./entities/stock-part.entity");
const app_service_1 = require("../app.service");
const bin_entity_1 = require("../bin/entities/bin.entity");
const model_entity_1 = require("../models/entities/model.entity");
const reference_entity_1 = require("../references/entities/reference.entity");
const all_part_entity_1 = require("../all-parts/entities/all-part.entity");
const models_module_1 = require("../models/models.module");
const references_module_1 = require("../references/references.module");
const branch_entity_1 = require("../branches/entities/branch.entity");
const company_entity_1 = require("../company/entities/company.entity");
let StockPartsModule = class StockPartsModule {
};
exports.StockPartsModule = StockPartsModule;
exports.StockPartsModule = StockPartsModule = __decorate([
    (0, common_1.Module)({
        imports: [models_module_1.ModelsModule, references_module_1.ReferencesModule, typeorm_1.TypeOrmModule.forFeature([stock_part_entity_1.StockPart, model_entity_1.Model, reference_entity_1.Reference, all_part_entity_1.AllPart, branch_entity_1.Branch, bin_entity_1.Bin, company_entity_1.Company])],
        controllers: [stock_parts_controller_1.StockPartsController],
        providers: [stock_parts_service_1.StockPartsService, app_service_1.AppService],
        exports: [stock_parts_service_1.StockPartsService]
    })
], StockPartsModule);
//# sourceMappingURL=stock-parts.module.js.map