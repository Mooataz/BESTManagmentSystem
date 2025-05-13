"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepairModule = void 0;
const common_1 = require("@nestjs/common");
const repair_service_1 = require("./repair.service");
const repair_controller_1 = require("./repair.controller");
const typeorm_1 = require("@nestjs/typeorm");
const repair_entity_1 = require("./entities/repair.entity");
const accessory_entity_1 = require("../accessory/entities/accessory.entity");
const list_fault_entity_1 = require("../list-fault/entities/list-fault.entity");
const customer_request_entity_1 = require("../customer-request/entities/customer-request.entity");
const notes_customer_entity_1 = require("../notes-customer/entities/notes-customer.entity");
const expertise_reason_entity_1 = require("../expertise-reasons/entities/expertise-reason.entity");
const repair_action_entity_1 = require("../repair-action/entities/repair-action.entity");
const app_service_1 = require("../app.service");
const user_entity_1 = require("../users/entities/user.entity");
const device_entity_1 = require("../devices/entities/device.entity");
const stock_part_entity_1 = require("../stock-parts/entities/stock-part.entity");
const approve_stock_entity_1 = require("../approve-stock/entities/approve-stock.entity");
let RepairModule = class RepairModule {
};
exports.RepairModule = RepairModule;
exports.RepairModule = RepairModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([repair_entity_1.Repair, accessory_entity_1.Accessory, list_fault_entity_1.ListFault, customer_request_entity_1.CustomerRequest, notes_customer_entity_1.NotesCustomer, expertise_reason_entity_1.ExpertiseReason, repair_action_entity_1.RepairAction, device_entity_1.Device, user_entity_1.User, stock_part_entity_1.StockPart, approve_stock_entity_1.ApproveStock])],
        controllers: [repair_controller_1.RepairController],
        providers: [repair_service_1.RepairService, app_service_1.AppService],
    })
], RepairModule);
//# sourceMappingURL=repair.module.js.map