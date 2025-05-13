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
exports.TracabilityController = void 0;
const common_1 = require("@nestjs/common");
const tracability_service_1 = require("./tracability.service");
const create_tracability_dto_1 = require("./dto/create-tracability.dto");
const update_tracability_dto_1 = require("./dto/update-tracability.dto");
let TracabilityController = class TracabilityController {
    tracabilityService;
    constructor(tracabilityService) {
        this.tracabilityService = tracabilityService;
    }
    async create(createTracabilityDto, res) {
        try {
            const newcreate = await this.tracabilityService.create(createTracabilityDto);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: "Data created Successfuly !",
                status: common_1.HttpStatus.CREATED,
                data: newcreate
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
            const findAll = await this.tracabilityService.findAll();
            return res.status(common_1.HttpStatus.OK).json({
                message: "All Data found successfuly !",
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
            const findOne = await this.tracabilityService.findOne(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "One Data found successfuly !",
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
    async update(id, updateTracabilityDto, res) {
        try {
            const updatedata = await this.tracabilityService.update(+id, updateTracabilityDto);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Data updates successfuly !",
                status: common_1.HttpStatus.OK,
                data: updatedata
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
            const deletedata = await this.tracabilityService.remove(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Data deleted successfuly !",
                status: common_1.HttpStatus.OK,
                data: deletedata
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
    async getByHistoryRepairId(historyRepairId, res) {
        try {
            const findtracability = await this.tracabilityService.findByHistoryRepairId(historyRepairId);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Founnd Successfuly !",
                status: common_1.HttpStatus.OK,
                data: findtracability
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
    async getByHistoryStockPartId(historyStockPartId, res) {
        try {
            const findtracability = await this.tracabilityService.findByHistoryStockPartId(historyStockPartId);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Founnd Successfuly !",
                status: common_1.HttpStatus.OK,
                data: findtracability
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
exports.TracabilityController = TracabilityController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tracability_dto_1.CreateTracabilityDto, Object]),
    __metadata("design:returntype", Promise)
], TracabilityController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TracabilityController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TracabilityController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_tracability_dto_1.UpdateTracabilityDto, Object]),
    __metadata("design:returntype", Promise)
], TracabilityController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TracabilityController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':historyRepairId'),
    __param(0, (0, common_1.Param)('historyRepairId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TracabilityController.prototype, "getByHistoryRepairId", null);
__decorate([
    (0, common_1.Get)(':historyRepairId'),
    __param(0, (0, common_1.Param)('historyStockPartId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TracabilityController.prototype, "getByHistoryStockPartId", null);
exports.TracabilityController = TracabilityController = __decorate([
    (0, common_1.Controller)('tracability'),
    __metadata("design:paramtypes", [tracability_service_1.TracabilityService])
], TracabilityController);
//# sourceMappingURL=tracability.controller.js.map