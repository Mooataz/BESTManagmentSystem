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
exports.CompanyController = void 0;
const common_1 = require("@nestjs/common");
const company_service_1 = require("./company.service");
const create_company_dto_1 = require("./dto/create-company.dto");
const update_company_dto_1 = require("./dto/update-company.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const swagger_1 = require("@nestjs/swagger");
let CompanyController = class CompanyController {
    companyService;
    constructor(companyService) {
        this.companyService = companyService;
    }
    async create(createCompanyDto, res, logo) {
        try {
            createCompanyDto.logo = logo.filename;
            const newUser = await this.companyService.create(createCompanyDto);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: "Company created Successfuly !",
                status: common_1.HttpStatus.CREATED,
                data: newUser
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
            const comp = await this.companyService.findAll();
            return res.status(common_1.HttpStatus.OK).json({
                message: "Company found successfuly !",
                status: common_1.HttpStatus.OK,
                data: comp
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
            const oneCompany = await this.companyService.findOne(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "One brand found successfuly !",
                status: common_1.HttpStatus.OK,
                data: oneCompany
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
    async update(id, updateCompanyDto, res, logo) {
        try {
            if (logo) {
                updateCompanyDto.logo = logo.filename;
            }
            const updatedata = await this.companyService.update(id, updateCompanyDto);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Company updated successfuly !",
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
            const deletedata = await this.companyService.remove(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Company deleted successfuly !",
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
exports.CompanyController = CompanyController;
__decorate([
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: "string" },
                headquarterslocation: { type: "string" },
                taxRegisterNumber: { type: "string" },
                rib: { type: "BigInt" },
                logo: { type: "string", format: "binary" },
                bank: { type: "string" },
                quantityAlertStock: { type: "number" }
            }
        }
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo', {
        storage: (0, multer_1.diskStorage)({
            destination: "./upload/company",
            filename: (_request, logo, callback) => callback(null, `${new Date().getTime()}-${logo.originalname}`)
        })
    })),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto, Object, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: "string" },
                headquarterslocation: { type: "string" },
                taxRegisterNumber: { type: "string" },
                rib: { type: "BigInt" },
                logo: { type: "string", format: "binary" },
                bank: { type: "string" }
            }
        }
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo', {
        storage: (0, multer_1.diskStorage)({
            destination: "./upload/company",
            filename: (_request, logo, callback) => callback(null, `${new Date().getTime()}-${logo.originalname}`)
        })
    })),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_company_dto_1.UpdateCompanyDto, Object, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "remove", null);
exports.CompanyController = CompanyController = __decorate([
    (0, common_1.Controller)('company'),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], CompanyController);
//# sourceMappingURL=company.controller.js.map