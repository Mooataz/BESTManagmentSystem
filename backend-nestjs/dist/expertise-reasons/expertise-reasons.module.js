"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpertiseReasonsModule = void 0;
const common_1 = require("@nestjs/common");
const expertise_reasons_service_1 = require("./expertise-reasons.service");
const expertise_reasons_controller_1 = require("./expertise-reasons.controller");
const typeorm_1 = require("@nestjs/typeorm");
const expertise_reason_entity_1 = require("./entities/expertise-reason.entity");
const app_service_1 = require("../app.service");
let ExpertiseReasonsModule = class ExpertiseReasonsModule {
};
exports.ExpertiseReasonsModule = ExpertiseReasonsModule;
exports.ExpertiseReasonsModule = ExpertiseReasonsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([expertise_reason_entity_1.ExpertiseReason])],
        controllers: [expertise_reasons_controller_1.ExpertiseReasonsController],
        providers: [expertise_reasons_service_1.ExpertiseReasonsService, app_service_1.AppService],
    })
], ExpertiseReasonsModule);
//# sourceMappingURL=expertise-reasons.module.js.map