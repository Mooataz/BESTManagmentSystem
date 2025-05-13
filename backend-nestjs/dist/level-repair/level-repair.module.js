"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelRepairModule = void 0;
const common_1 = require("@nestjs/common");
const level_repair_service_1 = require("./level-repair.service");
const level_repair_controller_1 = require("./level-repair.controller");
const typeorm_1 = require("@nestjs/typeorm");
const level_repair_entity_1 = require("./entities/level-repair.entity");
const app_service_1 = require("../app.service");
let LevelRepairModule = class LevelRepairModule {
};
exports.LevelRepairModule = LevelRepairModule;
exports.LevelRepairModule = LevelRepairModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([level_repair_entity_1.LevelRepair])],
        controllers: [level_repair_controller_1.LevelRepairController],
        providers: [level_repair_service_1.LevelRepairService, app_service_1.AppService],
    })
], LevelRepairModule);
//# sourceMappingURL=level-repair.module.js.map