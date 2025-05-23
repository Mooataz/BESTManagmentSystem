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
exports.BrandsController = void 0;
const common_1 = require("@nestjs/common");
const brands_service_1 = require("./brands.service");
const create_brand_dto_1 = require("./dto/create-brand.dto");
const update_brand_dto_1 = require("./dto/update-brand.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const swagger_1 = require("@nestjs/swagger");
let BrandsController = class BrandsController {
    brandsService;
    constructor(brandsService) {
        this.brandsService = brandsService;
    }
    async create(createBrandDto, res, logo) {
        console.log('REÇU', createBrandDto, logo);
        try {
            createBrandDto.logo = logo.filename;
            const newBrand = await this.brandsService.create(createBrandDto);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: "Brand created Successfuly !",
                status: common_1.HttpStatus.CREATED,
                data: newBrand
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
    async getBySaleId(status, res) {
        try {
            const allfind = await this.brandsService.findByStatus(status);
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
            const allBrands = await this.brandsService.findAll();
            return res.status(common_1.HttpStatus.OK).json({
                message: "All Brands found successfuly !",
                status: common_1.HttpStatus.OK,
                data: allBrands
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
            const findOne = await this.brandsService.findOne(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "One brand found successfuly !",
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
    async update(id, updateBrandDto, res, logo) {
        try {
            updateBrandDto.logo = logo?.filename;
            const updatedata = await this.brandsService.update(id, updateBrandDto);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Brand updates successfuly !",
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
            const deletedata = await this.brandsService.remove(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Brand deleted successfuly !",
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
exports.BrandsController = BrandsController;
__decorate([
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: "string" },
                logo: { type: "string", format: "binary" },
                status: { type: "string" }
            }
        }
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo', {
        storage: (0, multer_1.diskStorage)({
            destination: "./upload/brands",
            filename: (_request, logo, callback) => callback(null, `${new Date().getTime()}-${logo.originalname}`)
        })
    })),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_brand_dto_1.CreateBrandDto, Object, Object]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/findStatus/:status'),
    __param(0, (0, common_1.Param)('status')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "getBySaleId", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: "string" },
                logo: { type: "string", format: "binary" },
            }
        }
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo', {
        storage: (0, multer_1.diskStorage)({
            destination: "./upload/brands",
            filename: (_request, logo, callback) => callback(null, `${new Date().getTime()}-${logo.originalname}`)
        })
    })),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_brand_dto_1.UpdateBrandDto, Object, Object]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "remove", null);
exports.BrandsController = BrandsController = __decorate([
    (0, common_1.Controller)('brands'),
    __metadata("design:paramtypes", [brands_service_1.BrandsService])
], BrandsController);
//# sourceMappingURL=brands.controller.js.map