"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApproveStockModule = void 0;
const common_1 = require("@nestjs/common");
const approve_stock_service_1 = require("./approve-stock.service");
const approve_stock_controller_1 = require("./approve-stock.controller");
const typeorm_1 = require("@nestjs/typeorm");
const approve_stock_entity_1 = require("./entities/approve-stock.entity");
const app_service_1 = require("../app.service");
const stock_parts_service_1 = require("../stock-parts/stock-parts.service");
const bin_entity_1 = require("../bin/entities/bin.entity");
const stock_part_entity_1 = require("../stock-parts/entities/stock-part.entity");
const stock_parts_module_1 = require("../stock-parts/stock-parts.module");
const models_module_1 = require("../models/models.module");
const references_module_1 = require("../references/references.module");
const branch_entity_1 = require("../branches/entities/branch.entity");
const branches_module_1 = require("../branches/branches.module");
const company_entity_1 = require("../company/entities/company.entity");
let ApproveStockModule = class ApproveStockModule {
};
exports.ApproveStockModule = ApproveStockModule;
exports.ApproveStockModule = ApproveStockModule = __decorate([
    (0, common_1.Module)({
        imports: [branches_module_1.BranchesModule, models_module_1.ModelsModule, references_module_1.ReferencesModule, stock_parts_module_1.StockPartsModule, typeorm_1.TypeOrmModule.forFeature([approve_stock_entity_1.ApproveStock, stock_part_entity_1.StockPart, branch_entity_1.Branch, bin_entity_1.Bin, company_entity_1.Company])],
        controllers: [approve_stock_controller_1.ApproveStockController],
        providers: [approve_stock_service_1.ApproveStockService, stock_parts_service_1.StockPartsService, app_service_1.AppService],
        exports: [typeorm_1.TypeOrmModule, approve_stock_service_1.ApproveStockService],
    })
], ApproveStockModule);
//# sourceMappingURL=approve-stock.module.js.map