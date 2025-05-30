"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepairActionModule = void 0;
const common_1 = require("@nestjs/common");
const repair_action_service_1 = require("./repair-action.service");
const repair_action_controller_1 = require("./repair-action.controller");
const typeorm_1 = require("@nestjs/typeorm");
const repair_action_entity_1 = require("./entities/repair-action.entity");
let RepairActionModule = class RepairActionModule {
};
exports.RepairActionModule = RepairActionModule;
exports.RepairActionModule = RepairActionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([repair_action_entity_1.RepairAction])],
        controllers: [repair_action_controller_1.RepairActionController],
        providers: [repair_action_service_1.RepairActionService],
        exports: [typeorm_1.TypeOrmModule, repair_action_service_1.RepairActionService],
    })
], RepairActionModule);
//# sourceMappingURL=repair-action.module.js.map