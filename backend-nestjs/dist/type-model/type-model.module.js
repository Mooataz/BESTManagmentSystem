"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeModelModule = void 0;
const common_1 = require("@nestjs/common");
const type_model_service_1 = require("./type-model.service");
const type_model_controller_1 = require("./type-model.controller");
const typeorm_1 = require("@nestjs/typeorm");
const type_model_entity_1 = require("./entities/type-model.entity");
const app_service_1 = require("../app.service");
let TypeModelModule = class TypeModelModule {
};
exports.TypeModelModule = TypeModelModule;
exports.TypeModelModule = TypeModelModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([type_model_entity_1.TypeModel])],
        controllers: [type_model_controller_1.TypeModelController],
        providers: [type_model_service_1.TypeModelService, app_service_1.AppService],
    })
], TypeModelModule);
//# sourceMappingURL=type-model.module.js.map