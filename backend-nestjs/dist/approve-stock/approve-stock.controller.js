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
exports.ApproveStockController = void 0;
const common_1 = require("@nestjs/common");
const approve_stock_service_1 = require("./approve-stock.service");
const create_approve_stock_dto_1 = require("./dto/create-approve-stock.dto");
const update_approve_stock_dto_1 = require("./dto/update-approve-stock.dto");
let ApproveStockController = class ApproveStockController {
    approveStockService;
    constructor(approveStockService) {
        this.approveStockService = approveStockService;
    }
    async create(createApproveStockDto, res) {
        try {
            const newcreate = await this.approveStockService.create(createApproveStockDto);
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
    async getByRepairId(repairId, res) {
        try {
            const allfind = await this.approveStockService.findByRepairId(repairId);
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
    async getBySaleId(saleId, res) {
        try {
            const allfind = await this.approveStockService.findBySaleId(saleId);
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
    async getByBranchId(branchId, res) {
        try {
            const allfind = await this.approveStockService.findByBranchId(branchId);
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
    async getByType(type, res) {
        try {
            const allfind = await this.approveStockService.findByType(type);
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
    async getByState(state, res) {
        try {
            const allfind = await this.approveStockService.findByState(state);
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
            const findAll = await this.approveStockService.findAll();
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
            const findOne = await this.approveStockService.findOne(+id);
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
    async update(id, updateApproveStockDto, res) {
        try {
            const updatedata = await this.approveStockService.update(+id, updateApproveStockDto);
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
    async updateStateApprove(id, binDefectId, updateApproveStockDto, res) {
        try {
            const updatedata = await this.approveStockService.updateState(id, binDefectId, updateApproveStockDto);
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
            const deletedata = await this.approveStockService.remove(+id);
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
};
exports.ApproveStockController = ApproveStockController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_approve_stock_dto_1.CreateApproveStockDto, Object]),
    __metadata("design:returntype", Promise)
], ApproveStockController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/findByRepair/:repairId'),
    __param(0, (0, common_1.Param)('repairId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ApproveStockController.prototype, "getByRepairId", null);
__decorate([
    (0, common_1.Get)('/findBySale/:saleId'),
    __param(0, (0, common_1.Param)('saleId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ApproveStockController.prototype, "getBySaleId", null);
__decorate([
    (0, common_1.Get)('/findByBranch/:branchId'),
    __param(0, (0, common_1.Param)('branchId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ApproveStockController.prototype, "getByBranchId", null);
__decorate([
    (0, common_1.Get)('/findByType/:type'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApproveStockController.prototype, "getByType", null);
__decorate([
    (0, common_1.Get)('/findByState/:state'),
    __param(0, (0, common_1.Param)('state')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApproveStockController.prototype, "getByState", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApproveStockController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ApproveStockController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_approve_stock_dto_1.UpdateApproveStockDto, Object]),
    __metadata("design:returntype", Promise)
], ApproveStockController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('updateState/:id/:binDefectId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('binDefectId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, update_approve_stock_dto_1.UpdateApproveStockDto, Object]),
    __metadata("design:returntype", Promise)
], ApproveStockController.prototype, "updateStateApprove", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ApproveStockController.prototype, "remove", null);
exports.ApproveStockController = ApproveStockController = __decorate([
    (0, common_1.Controller)('approve-stock'),
    __metadata("design:paramtypes", [approve_stock_service_1.ApproveStockService])
], ApproveStockController);
//# sourceMappingURL=approve-stock.controller.js.map