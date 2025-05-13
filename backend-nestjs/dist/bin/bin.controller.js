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
exports.BinController = void 0;
const common_1 = require("@nestjs/common");
const bin_service_1 = require("./bin.service");
const create_bin_dto_1 = require("./dto/create-bin.dto");
const update_bin_dto_1 = require("./dto/update-bin.dto");
let BinController = class BinController {
    binService;
    constructor(binService) {
        this.binService = binService;
    }
    async create(createBinDto, res) {
        try {
            const newCreate = await this.binService.create(createBinDto);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: "Created Successfuly !",
                status: common_1.HttpStatus.CREATED,
                data: newCreate
            });
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('Bin already exists');
            }
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
                data: null
            });
        }
    }
    async getByBranchId(branchId, res) {
        try {
            const allfind = await this.binService.findByBranchId(branchId);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Founded Successfuly !",
                status: common_1.HttpStatus.OK,
                data: allfind
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
    async getByBranchIdAndType(branchId, type, res) {
        try {
            const allfind = await this.binService.findByBranchIdAndType(branchId, type);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Founded Successfuly !",
                status: common_1.HttpStatus.OK,
                data: allfind
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
            const allfind = await this.binService.findAll();
            return res.status(common_1.HttpStatus.OK).json({
                message: "Types founded Successfuly !",
                status: common_1.HttpStatus.OK,
                data: allfind
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
            const onefind = await this.binService.findOne(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "founded Successfuly !",
                status: common_1.HttpStatus.OK,
                data: onefind
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
    async update(id, updateBinDto, res) {
        try {
            const updateType = await this.binService.update(+id, updateBinDto);
            return res.status(common_1.HttpStatus.OK).json({
                message: "updated Successfuly !",
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
            const deleteType = await this.binService.remove(+id);
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
};
exports.BinController = BinController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bin_dto_1.CreateBinDto, Object]),
    __metadata("design:returntype", Promise)
], BinController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/find/:branchId'),
    __param(0, (0, common_1.Param)('branchId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BinController.prototype, "getByBranchId", null);
__decorate([
    (0, common_1.Get)('/find/:branchId/:type'),
    __param(0, (0, common_1.Param)('branchId')),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], BinController.prototype, "getByBranchIdAndType", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BinController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BinController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_bin_dto_1.UpdateBinDto, Object]),
    __metadata("design:returntype", Promise)
], BinController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BinController.prototype, "remove", null);
exports.BinController = BinController = __decorate([
    (0, common_1.Controller)('bin'),
    __metadata("design:paramtypes", [bin_service_1.BinService])
], BinController);
//# sourceMappingURL=bin.controller.js.map