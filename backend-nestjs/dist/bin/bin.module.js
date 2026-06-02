"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinModule = void 0;
const common_1 = require("@nestjs/common");
const bin_service_1 = require("./bin.service");
const bin_controller_1 = require("./bin.controller");
const typeorm_1 = require("@nestjs/typeorm");
const bin_entity_1 = require("./entities/bin.entity");
const branch_entity_1 = require("../branches/entities/branch.entity");
const app_service_1 = require("../app.service");
let BinModule = class BinModule {
};
exports.BinModule = BinModule;
exports.BinModule = BinModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([bin_entity_1.Bin, branch_entity_1.Branch])],
        controllers: [bin_controller_1.BinController],
        providers: [bin_service_1.BinService, app_service_1.AppService],
    })
], BinModule);
//# sourceMappingURL=bin.module.js.map