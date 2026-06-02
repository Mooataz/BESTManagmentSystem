"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegislationModule = void 0;
const common_1 = require("@nestjs/common");
const legislation_service_1 = require("./legislation.service");
const legislation_controller_1 = require("./legislation.controller");
const typeorm_1 = require("@nestjs/typeorm");
const legislation_entity_1 = require("./entities/legislation.entity");
const app_service_1 = require("../app.service");
let LegislationModule = class LegislationModule {
};
exports.LegislationModule = LegislationModule;
exports.LegislationModule = LegislationModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([legislation_entity_1.Legislation])],
        controllers: [legislation_controller_1.LegislationController],
        providers: [legislation_service_1.LegislationService, app_service_1.AppService],
    })
], LegislationModule);
//# sourceMappingURL=legislation.module.js.map