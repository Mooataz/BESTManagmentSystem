"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StocKeeperController = void 0;
const common_1 = require("@nestjs/common");
const stoc_keeper_service_1 = require("./stoc-keeper.service");
const create_stoc_keeper_dto_1 = require("./dto/create-stoc-keeper.dto");
const update_stoc_keeper_dto_1 = require("./dto/update-stoc-keeper.dto");
let StocKeeperController = class StocKeeperController {
    stocKeeperService;
    constructor(stocKeeperService) {
        this.stocKeeperService = stocKeeperService;
    }
    create(createStocKeeperDto) {
        return this.stocKeeperService.create(createStocKeeperDto);
    }
    findAll() {
        return this.stocKeeperService.findAll();
    }
    findOne(id) {
        return this.stocKeeperService.findOne(+id);
    }
    update(id, updateStocKeeperDto) {
        return this.stocKeeperService.update(+id, updateStocKeeperDto);
    }
    remove(id) {
        return this.stocKeeperService.remove(+id);
    }
};
exports.StocKeeperController = StocKeeperController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_stoc_keeper_dto_1.CreateStocKeeperDto]),
    __metadata("design:returntype", void 0)
], StocKeeperController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StocKeeperController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StocKeeperController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_stoc_keeper_dto_1.UpdateStocKeeperDto]),
    __metadata("design:returntype", void 0)
], StocKeeperController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StocKeeperController.prototype, "remove", null);
exports.StocKeeperController = StocKeeperController = __decorate([
    (0, common_1.Controller)('stoc-keeper'),
    __metadata("design:paramtypes", [stoc_keeper_service_1.StocKeeperService])
], StocKeeperController);
//# sourceMappingURL=stoc-keeper.controller.js.map