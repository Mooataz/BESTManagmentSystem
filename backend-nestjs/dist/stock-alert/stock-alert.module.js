"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockAlertModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const stock_alert_entity_1 = require("./entities/stock-alert.entity");
const stock_alert_service_1 = require("./stock-alert.service");
const stock_alert_controller_1 = require("./stock-alert.controller");
const company_entity_1 = require("../company/entities/company.entity");
const model_entity_1 = require("../models/entities/model.entity");
const all_part_entity_1 = require("../all-parts/entities/all-part.entity");
const reference_entity_1 = require("../references/entities/reference.entity");
const stock_part_entity_1 = require("../stock-parts/entities/stock-part.entity");
const bin_entity_1 = require("../bin/entities/bin.entity");
const branch_entity_1 = require("../branches/entities/branch.entity");
const user_entity_1 = require("../users/entities/user.entity");
const pdf_service_1 = require("../pdf/pdf.service");
const repair_entity_1 = require("../repair/entities/repair.entity");
const legislation_entity_1 = require("../legislation/entities/legislation.entity");
let StockAlertModule = class StockAlertModule {
};
exports.StockAlertModule = StockAlertModule;
exports.StockAlertModule = StockAlertModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                stock_alert_entity_1.StockAlert,
                company_entity_1.Company,
                model_entity_1.Model,
                all_part_entity_1.AllPart,
                reference_entity_1.Reference,
                stock_part_entity_1.StockPart,
                bin_entity_1.Bin,
                branch_entity_1.Branch,
                user_entity_1.User,
                repair_entity_1.Repair,
                legislation_entity_1.Legislation,
            ]),
        ],
        controllers: [stock_alert_controller_1.StockAlertController],
        providers: [stock_alert_service_1.StockAlertService, pdf_service_1.PdfService],
        exports: [stock_alert_service_1.StockAlertService],
    })
], StockAlertModule);
//# sourceMappingURL=stock-alert.module.js.map