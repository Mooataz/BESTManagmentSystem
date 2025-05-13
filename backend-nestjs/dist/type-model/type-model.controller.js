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
exports.TypeModelController = void 0;
const common_1 = require("@nestjs/common");
const type_model_service_1 = require("./type-model.service");
const create_type_model_dto_1 = require("./dto/create-type-model.dto");
const update_type_model_dto_1 = require("./dto/update-type-model.dto");
let TypeModelController = class TypeModelController {
    typeModelService;
    constructor(typeModelService) {
        this.typeModelService = typeModelService;
    }
    async create(createTypeModelDto, res, req) {
        try {
            const newType = await this.typeModelService.create(createTypeModelDto);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: "Type created Successfuly !",
                status: common_1.HttpStatus.CREATED,
                data: newType
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
    async findAll(res) {
        try {
            const allTypes = await this.typeModelService.findAll();
            return res.status(common_1.HttpStatus.OK).json({
                message: "Types founded Successfuly !",
                status: common_1.HttpStatus.OK,
                data: allTypes
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
            const oneType = await this.typeModelService.findOne(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Type founded Successfuly !",
                status: common_1.HttpStatus.OK,
                data: oneType
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
    async update(id, updateTypeModelDto, res) {
        try {
            const updateType = await this.typeModelService.update(+id, updateTypeModelDto);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Type updated Successfuly !",
                status: common_1.HttpStatus.OK,
                data: updateType
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
            const deleteType = await this.typeModelService.remove(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Type updated Successfuly !",
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
};
exports.TypeModelController = TypeModelController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_type_model_dto_1.CreateTypeModelDto, Object, Request]),
    __metadata("design:returntype", Promise)
], TypeModelController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TypeModelController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TypeModelController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_type_model_dto_1.UpdateTypeModelDto, Object]),
    __metadata("design:returntype", Promise)
], TypeModelController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TypeModelController.prototype, "remove", null);
exports.TypeModelController = TypeModelController = __decorate([
    (0, common_1.Controller)('type-model'),
    __metadata("design:paramtypes", [type_model_service_1.TypeModelService])
], TypeModelController);
//# sourceMappingURL=type-model.controller.js.map