"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessoryModule = void 0;
const common_1 = require("@nestjs/common");
const accessory_service_1 = require("./accessory.service");
const accessory_controller_1 = require("./accessory.controller");
const typeorm_1 = require("@nestjs/typeorm");
const accessory_entity_1 = require("./entities/accessory.entity");
const app_service_1 = require("../app.service");
let AccessoryModule = class AccessoryModule {
};
exports.AccessoryModule = AccessoryModule;
exports.AccessoryModule = AccessoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([accessory_entity_1.Accessory])],
        controllers: [accessory_controller_1.AccessoryController],
        providers: [accessory_service_1.AccessoryService, app_service_1.AppService],
        exports: [typeorm_1.TypeOrmModule, accessory_service_1.AccessoryService],
    })
], AccessoryModule);
//# sourceMappingURL=accessory.module.js.map