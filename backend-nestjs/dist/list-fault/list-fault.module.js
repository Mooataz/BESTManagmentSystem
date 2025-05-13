"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListFaultModule = void 0;
const common_1 = require("@nestjs/common");
const list_fault_service_1 = require("./list-fault.service");
const list_fault_controller_1 = require("./list-fault.controller");
const typeorm_1 = require("@nestjs/typeorm");
const list_fault_entity_1 = require("./entities/list-fault.entity");
const app_service_1 = require("../app.service");
let ListFaultModule = class ListFaultModule {
};
exports.ListFaultModule = ListFaultModule;
exports.ListFaultModule = ListFaultModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([list_fault_entity_1.ListFault])],
        controllers: [list_fault_controller_1.ListFaultController],
        providers: [list_fault_service_1.ListFaultService, app_service_1.AppService],
    })
], ListFaultModule);
//# sourceMappingURL=list-fault.module.js.map