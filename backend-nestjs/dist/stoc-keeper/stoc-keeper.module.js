"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StocKeeperModule = void 0;
const common_1 = require("@nestjs/common");
const stoc_keeper_service_1 = require("./stoc-keeper.service");
const stoc_keeper_controller_1 = require("./stoc-keeper.controller");
let StocKeeperModule = class StocKeeperModule {
};
exports.StocKeeperModule = StocKeeperModule;
exports.StocKeeperModule = StocKeeperModule = __decorate([
    (0, common_1.Module)({
        controllers: [stoc_keeper_controller_1.StocKeeperController],
        providers: [stoc_keeper_service_1.StocKeeperService],
    })
], StocKeeperModule);
//# sourceMappingURL=stoc-keeper.module.js.map