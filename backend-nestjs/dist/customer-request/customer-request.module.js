"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRequestModule = void 0;
const common_1 = require("@nestjs/common");
const customer_request_service_1 = require("./customer-request.service");
const customer_request_controller_1 = require("./customer-request.controller");
const typeorm_1 = require("@nestjs/typeorm");
const customer_request_entity_1 = require("./entities/customer-request.entity");
const app_service_1 = require("../app.service");
let CustomerRequestModule = class CustomerRequestModule {
};
exports.CustomerRequestModule = CustomerRequestModule;
exports.CustomerRequestModule = CustomerRequestModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([customer_request_entity_1.CustomerRequest])],
        controllers: [customer_request_controller_1.CustomerRequestController],
        providers: [customer_request_service_1.CustomerRequestService, app_service_1.AppService],
        exports: [typeorm_1.TypeOrmModule, customer_request_service_1.CustomerRequestService],
    })
], CustomerRequestModule);
//# sourceMappingURL=customer-request.module.js.map