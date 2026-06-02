"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputListModule = void 0;
const common_1 = require("@nestjs/common");
const output_list_service_1 = require("./output-list.service");
const output_list_controller_1 = require("./output-list.controller");
const typeorm_1 = require("@nestjs/typeorm");
const output_list_entity_1 = require("./entities/output-list.entity");
const repair_entity_1 = require("../repair/entities/repair.entity");
const user_entity_1 = require("../users/entities/user.entity");
const customer_entity_1 = require("../customers/entities/customer.entity");
let OutputListModule = class OutputListModule {
};
exports.OutputListModule = OutputListModule;
exports.OutputListModule = OutputListModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([output_list_entity_1.OutputList, repair_entity_1.Repair, user_entity_1.User, customer_entity_1.Customer])],
        controllers: [output_list_controller_1.OutputListController],
        providers: [output_list_service_1.OutputListService],
    })
], OutputListModule);
//# sourceMappingURL=output-list.module.js.map