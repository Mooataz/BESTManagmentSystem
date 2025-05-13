"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesCustomerModule = void 0;
const common_1 = require("@nestjs/common");
const notes_customer_service_1 = require("./notes-customer.service");
const notes_customer_controller_1 = require("./notes-customer.controller");
const typeorm_1 = require("@nestjs/typeorm");
const notes_customer_entity_1 = require("./entities/notes-customer.entity");
const app_service_1 = require("../app.service");
let NotesCustomerModule = class NotesCustomerModule {
};
exports.NotesCustomerModule = NotesCustomerModule;
exports.NotesCustomerModule = NotesCustomerModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([notes_customer_entity_1.NotesCustomer])],
        controllers: [notes_customer_controller_1.NotesCustomerController],
        providers: [notes_customer_service_1.NotesCustomerService, app_service_1.AppService],
    })
], NotesCustomerModule);
//# sourceMappingURL=notes-customer.module.js.map