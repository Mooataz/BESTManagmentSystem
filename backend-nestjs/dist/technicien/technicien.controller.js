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
exports.TechnicienController = void 0;
const common_1 = require("@nestjs/common");
const technicien_service_1 = require("./technicien.service");
const create_technicien_dto_1 = require("./dto/create-technicien.dto");
const update_technicien_dto_1 = require("./dto/update-technicien.dto");
let TechnicienController = class TechnicienController {
    technicienService;
    constructor(technicienService) {
        this.technicienService = technicienService;
    }
    create(createTechnicienDto) {
        return this.technicienService.create(createTechnicienDto);
    }
    findAll() {
        return this.technicienService.findAll();
    }
    findOne(id) {
        return this.technicienService.findOne(+id);
    }
    update(id, updateTechnicienDto) {
        return this.technicienService.update(+id, updateTechnicienDto);
    }
    remove(id) {
        return this.technicienService.remove(+id);
    }
};
exports.TechnicienController = TechnicienController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_technicien_dto_1.CreateTechnicienDto]),
    __metadata("design:returntype", void 0)
], TechnicienController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TechnicienController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TechnicienController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_technicien_dto_1.UpdateTechnicienDto]),
    __metadata("design:returntype", void 0)
], TechnicienController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TechnicienController.prototype, "remove", null);
exports.TechnicienController = TechnicienController = __decorate([
    (0, common_1.Controller)('technicien'),
    __metadata("design:paramtypes", [technicien_service_1.TechnicienService])
], TechnicienController);
//# sourceMappingURL=technicien.controller.js.map