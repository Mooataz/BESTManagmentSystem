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
exports.CoreController = void 0;
const common_1 = require("@nestjs/common");
const core_service_1 = require("./core.service");
const create_core_dto_1 = require("./dto/create-core.dto");
const update_core_dto_1 = require("./dto/update-core.dto");
let CoreController = class CoreController {
    coreService;
    constructor(coreService) {
        this.coreService = coreService;
    }
    create(createCoreDto) {
        return this.coreService.create(createCoreDto);
    }
    findAll() {
        return this.coreService.findAll();
    }
    findOne(id) {
        return this.coreService.findOne(+id);
    }
    update(id, updateCoreDto) {
        return this.coreService.update(+id, updateCoreDto);
    }
    remove(id) {
        return this.coreService.remove(+id);
    }
};
exports.CoreController = CoreController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_core_dto_1.CreateCoreDto]),
    __metadata("design:returntype", void 0)
], CoreController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CoreController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoreController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_core_dto_1.UpdateCoreDto]),
    __metadata("design:returntype", void 0)
], CoreController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoreController.prototype, "remove", null);
exports.CoreController = CoreController = __decorate([
    (0, common_1.Controller)('core'),
    __metadata("design:paramtypes", [core_service_1.CoreService])
], CoreController);
//# sourceMappingURL=core.controller.js.map