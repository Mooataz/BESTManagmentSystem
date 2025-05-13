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
exports.PartsPriceController = void 0;
const common_1 = require("@nestjs/common");
const parts_price_service_1 = require("./parts-price.service");
const create_parts_price_dto_1 = require("./dto/create-parts-price.dto");
const update_parts_price_dto_1 = require("./dto/update-parts-price.dto");
let PartsPriceController = class PartsPriceController {
    partsPriceService;
    constructor(partsPriceService) {
        this.partsPriceService = partsPriceService;
    }
    async create(createPartsPriceDto, res) {
        try {
            const newPrice = await this.partsPriceService.create(createPartsPriceDto);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: "Price created Successfuly !",
                status: common_1.HttpStatus.CREATED,
                data: newPrice
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
            const allTypes = await this.partsPriceService.findAll();
            return res.status(common_1.HttpStatus.OK).json({
                message: "Data founded Successfuly !",
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
            const allTypes = await this.partsPriceService.findOne(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Data founded Successfuly !",
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
    async update(id, updatePartsPriceDto, res) {
        try {
            const allTypes = await this.partsPriceService.update(+id, updatePartsPriceDto);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Data updated Successfuly !",
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
    async remove(id, res) {
        try {
            const allTypes = await this.partsPriceService.remove(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Data deleted Successfuly !",
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
    async findPartsPriceByModelAndAllPart(modelId, allPartId, res) {
        try {
            const partsPrice = await this.partsPriceService.findByModelallPArt(modelId, allPartId);
            return res.status(common_1.HttpStatus.OK).json({
                message: `Price Part founded for modelId ${modelId} and allPartId ${allPartId}`,
                status: common_1.HttpStatus.OK,
                data: partsPrice
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
exports.PartsPriceController = PartsPriceController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_parts_price_dto_1.CreatePartsPriceDto, Object]),
    __metadata("design:returntype", Promise)
], PartsPriceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PartsPriceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PartsPriceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_parts_price_dto_1.UpdatePartsPriceDto, Object]),
    __metadata("design:returntype", Promise)
], PartsPriceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PartsPriceController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':modelId/:allPartId'),
    __param(0, (0, common_1.Param)('modelId')),
    __param(1, (0, common_1.Param)('allPartId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PartsPriceController.prototype, "findPartsPriceByModelAndAllPart", null);
exports.PartsPriceController = PartsPriceController = __decorate([
    (0, common_1.Controller)('parts-price'),
    __metadata("design:paramtypes", [parts_price_service_1.PartsPriceService])
], PartsPriceController);
//# sourceMappingURL=parts-price.controller.js.map