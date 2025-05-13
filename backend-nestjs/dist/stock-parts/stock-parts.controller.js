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
exports.StockPartsController = void 0;
const common_1 = require("@nestjs/common");
const stock_parts_service_1 = require("./stock-parts.service");
const create_stock_part_dto_1 = require("./dto/create-stock-part.dto");
const update_stock_part_dto_1 = require("./dto/update-stock-part.dto");
let StockPartsController = class StockPartsController {
    stockPartsService;
    constructor(stockPartsService) {
        this.stockPartsService = stockPartsService;
    }
    async create(createStockPartDto, res) {
        try {
            const newCreate = await this.stockPartsService.create(createStockPartDto);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: "Created Successfuly !",
                status: common_1.HttpStatus.CREATED,
                data: newCreate
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
            const allfind = await this.stockPartsService.findAll();
            return res.status(common_1.HttpStatus.OK).json({
                message: " founded Successfuly !",
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
            const onefind = await this.stockPartsService.findOne(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: " founded Successfuly !",
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
    async update(id, updateStockPartDto, res) {
        try {
            const updateType = await this.stockPartsService.update(+id, updateStockPartDto);
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
            const deleteType = await this.stockPartsService.remove(+id);
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
    async getByBinId(binId, res) {
        try {
            const allfind = await this.stockPartsService.findByBinId(binId);
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
    async filterStockParts(references, binType, res) {
        try {
            const result = await this.stockPartsService.filterByReferenceAndBin(references, binType);
            return res.status(common_1.HttpStatus.OK).json({
                message: 'Found successfully!',
                status: common_1.HttpStatus.OK,
                data: result,
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                message: error.message,
                status: common_1.HttpStatus.BAD_REQUEST,
                data: null,
            });
        }
    }
    async getByBinType(type, branchId, res) {
        try {
            const allfind = await this.stockPartsService.findByBinType(type, branchId);
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
    async getStateStock(res) {
        try {
            const allfind = await this.stockPartsService.stateStock();
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
};
exports.StockPartsController = StockPartsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_stock_part_dto_1.CreateStockPartDto, Object]),
    __metadata("design:returntype", Promise)
], StockPartsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StockPartsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StockPartsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_stock_part_dto_1.UpdateStockPartDto, Object]),
    __metadata("design:returntype", Promise)
], StockPartsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StockPartsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('/find/:binId'),
    __param(0, (0, common_1.Param)('binId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], StockPartsController.prototype, "getByBinId", null);
__decorate([
    (0, common_1.Get)('filter/:references/:bin'),
    __param(0, (0, common_1.Param)('references', new common_1.ParseArrayPipe({ items: Number, separator: ',' }))),
    __param(1, (0, common_1.Param)('bin')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Number, Object]),
    __metadata("design:returntype", Promise)
], StockPartsController.prototype, "filterStockParts", null);
__decorate([
    (0, common_1.Get)('/find/:type/:branchId'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('branchId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], StockPartsController.prototype, "getByBinType", null);
__decorate([
    (0, common_1.Get)('stateStock'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StockPartsController.prototype, "getStateStock", null);
exports.StockPartsController = StockPartsController = __decorate([
    (0, common_1.Controller)('stock-parts'),
    __metadata("design:paramtypes", [stock_parts_service_1.StockPartsService])
], StockPartsController);
//# sourceMappingURL=stock-parts.controller.js.map