"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributeurModule = void 0;
const common_1 = require("@nestjs/common");
const distributeur_service_1 = require("./distributeur.service");
const distributeur_controller_1 = require("./distributeur.controller");
const typeorm_1 = require("@nestjs/typeorm");
const distributeur_entity_1 = require("./entities/distributeur.entity");
const app_service_1 = require("../app.service");
let DistributeurModule = class DistributeurModule {
};
exports.DistributeurModule = DistributeurModule;
exports.DistributeurModule = DistributeurModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([distributeur_entity_1.Distributeur])],
        controllers: [distributeur_controller_1.DistributeurController],
        providers: [distributeur_service_1.DistributeurService, app_service_1.AppService],
    })
], DistributeurModule);
//# sourceMappingURL=distributeur.module.js.map