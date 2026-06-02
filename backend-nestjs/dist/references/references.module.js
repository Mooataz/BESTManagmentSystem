"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferencesModule = void 0;
const common_1 = require("@nestjs/common");
const references_service_1 = require("./references.service");
const references_controller_1 = require("./references.controller");
const typeorm_1 = require("@nestjs/typeorm");
const reference_entity_1 = require("./entities/reference.entity");
const model_entity_1 = require("../models/entities/model.entity");
const all_part_entity_1 = require("../all-parts/entities/all-part.entity");
const app_service_1 = require("../app.service");
let ReferencesModule = class ReferencesModule {
};
exports.ReferencesModule = ReferencesModule;
exports.ReferencesModule = ReferencesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([reference_entity_1.Reference, model_entity_1.Model, all_part_entity_1.AllPart])],
        controllers: [references_controller_1.ReferencesController],
        providers: [references_service_1.ReferencesService, app_service_1.AppService],
        exports: [references_service_1.ReferencesService]
    })
], ReferencesModule);
//# sourceMappingURL=references.module.js.map