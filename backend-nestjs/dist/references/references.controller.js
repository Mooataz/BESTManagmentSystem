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
exports.ReferencesController = void 0;
const common_1 = require("@nestjs/common");
const references_service_1 = require("./references.service");
const create_reference_dto_1 = require("./dto/create-reference.dto");
const update_reference_dto_1 = require("./dto/update-reference.dto");
let ReferencesController = class ReferencesController {
    referencesService;
    constructor(referencesService) {
        this.referencesService = referencesService;
    }
    async create(createReferenceDto, res) {
        try {
            const newcreate = await this.referencesService.create(createReferenceDto);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: "reference created Successfuly !",
                status: common_1.HttpStatus.CREATED,
                data: newcreate
            });
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('reference already exists');
            }
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
                data: null
            });
        }
    }
    async findAll(res) {
        try {
            const findAll = await this.referencesService.findAll();
            return res.status(common_1.HttpStatus.OK).json({
                message: "reference founded Successfuly !",
                status: common_1.HttpStatus.OK,
                data: findAll
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
                data: null
            });
        }
    }
    async findOne(id, res) {
        try {
            const findOne = await this.referencesService.findOne(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "reference founded Successfuly !",
                status: common_1.HttpStatus.OK,
                data: findOne
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
                data: null
            });
        }
    }
    async update(id, updateReferenceDto, res) {
        try {
            const update = await this.referencesService.update(+id, updateReferenceDto);
            return res.status(common_1.HttpStatus.OK).json({
                message: "reference updated Successfuly !",
                status: common_1.HttpStatus.OK,
                data: update
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
                data: null
            });
        }
    }
    async remove(id, res) {
        try {
            const deleteType = await this.referencesService.remove(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Deleted Successfuly !",
                status: common_1.HttpStatus.OK,
                data: deleteType
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
                data: null
            });
        }
    }
    async getCompatibleReferences(modelId, partId, res) {
        try {
            const findReferences = await this.referencesService.findCompatibleReferences(modelId, partId);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Founnd Successfuly !",
                status: common_1.HttpStatus.OK,
                data: findReferences
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
                data: null
            });
        }
    }
    async getByMaterialCode(materialCode, res) {
        try {
            const findReferences = await this.referencesService.findByMaterialCode(materialCode);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Founnd Successfuly !",
                status: common_1.HttpStatus.OK,
                data: findReferences
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
                data: null
            });
        }
    }
};
exports.ReferencesController = ReferencesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reference_dto_1.CreateReferenceDto, Object]),
    __metadata("design:returntype", Promise)
], ReferencesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReferencesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ReferencesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_reference_dto_1.UpdateReferenceDto, Object]),
    __metadata("design:returntype", Promise)
], ReferencesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ReferencesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':modelId/:partId'),
    __param(0, (0, common_1.Param)('modelId')),
    __param(1, (0, common_1.Param)('partId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ReferencesController.prototype, "getCompatibleReferences", null);
__decorate([
    (0, common_1.Get)('findByMC/:materialCode'),
    __param(0, (0, common_1.Param)('materialCode')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReferencesController.prototype, "getByMaterialCode", null);
exports.ReferencesController = ReferencesController = __decorate([
    (0, common_1.Controller)('references'),
    __metadata("design:paramtypes", [references_service_1.ReferencesService])
], ReferencesController);
//# sourceMappingURL=references.controller.js.map