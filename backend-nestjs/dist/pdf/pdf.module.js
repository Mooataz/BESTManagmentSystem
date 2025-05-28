"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfModule = void 0;
const common_1 = require("@nestjs/common");
const pdf_service_1 = require("./pdf.service");
const pdf_controller_1 = require("./pdf.controller");
const repair_entity_1 = require("../repair/entities/repair.entity");
const typeorm_1 = require("@nestjs/typeorm");
const customer_entity_1 = require("../customers/entities/customer.entity");
const device_entity_1 = require("../devices/entities/device.entity");
const repair_module_1 = require("../repair/repair.module");
const repair_service_1 = require("../repair/repair.service");
const accessory_module_1 = require("../accessory/accessory.module");
const list_fault_module_1 = require("../list-fault/list-fault.module");
const customer_request_module_1 = require("../customer-request/customer-request.module");
const notes_customer_module_1 = require("../notes-customer/notes-customer.module");
const expertise_reasons_module_1 = require("../expertise-reasons/expertise-reasons.module");
const repair_action_module_1 = require("../repair-action/repair-action.module");
const users_module_1 = require("../users/users.module");
const stock_parts_module_1 = require("../stock-parts/stock-parts.module");
const approve_stock_module_1 = require("../approve-stock/approve-stock.module");
const core_module_1 = require("../core/core.module");
let PdfModule = class PdfModule {
};
exports.PdfModule = PdfModule;
exports.PdfModule = PdfModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => repair_module_1.RepairModule),
            (0, common_1.forwardRef)(() => approve_stock_module_1.ApproveStockModule),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            (0, common_1.forwardRef)(() => repair_action_module_1.RepairActionModule),
            (0, common_1.forwardRef)(() => list_fault_module_1.ListFaultModule),
            (0, common_1.forwardRef)(() => stock_parts_module_1.StockPartsModule),
            (0, common_1.forwardRef)(() => expertise_reasons_module_1.ExpertiseReasonsModule),
            (0, common_1.forwardRef)(() => customer_request_module_1.CustomerRequestModule),
            (0, common_1.forwardRef)(() => notes_customer_module_1.NotesCustomerModule),
            (0, common_1.forwardRef)(() => accessory_module_1.AccessoryModule),
            core_module_1.CoreModule,
            typeorm_1.TypeOrmModule.forFeature([repair_entity_1.Repair, customer_entity_1.Customer, device_entity_1.Device]),
        ],
        controllers: [pdf_controller_1.PdfController],
        providers: [pdf_service_1.PdfService, repair_service_1.RepairService],
        exports: [pdf_service_1.PdfService]
    })
], PdfModule);
//# sourceMappingURL=pdf.module.js.map