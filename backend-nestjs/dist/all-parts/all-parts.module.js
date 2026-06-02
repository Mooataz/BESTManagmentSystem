"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllPartsModule = void 0;
const common_1 = require("@nestjs/common");
const all_parts_service_1 = require("./all-parts.service");
const all_parts_controller_1 = require("./all-parts.controller");
const typeorm_1 = require("@nestjs/typeorm");
const all_part_entity_1 = require("./entities/all-part.entity");
const app_service_1 = require("../app.service");
let AllPartsModule = class AllPartsModule {
};
exports.AllPartsModule = AllPartsModule;
exports.AllPartsModule = AllPartsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([all_part_entity_1.AllPart])],
        controllers: [all_parts_controller_1.AllPartsController],
        providers: [all_parts_service_1.AllPartsService, app_service_1.AppService],
    })
], AllPartsModule);
//# sourceMappingURL=all-parts.module.js.map