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
exports.ModelsController = void 0;
const common_1 = require("@nestjs/common");
const models_service_1 = require("./models.service");
const create_model_dto_1 = require("./dto/create-model.dto");
const update_model_dto_1 = require("./dto/update-model.dto");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
let ModelsController = class ModelsController {
    modelsService;
    constructor(modelsService) {
        this.modelsService = modelsService;
    }
    async create(createModelDto, res, picture) {
        try {
            createModelDto.picture = picture.filename;
            if (typeof createModelDto.allpartIds === 'string') {
                createModelDto.allpartIds = JSON.parse(createModelDto.allpartIds);
            }
            const newUser = await this.modelsService.create(createModelDto);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: "Model created Successfuly !",
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
    async getBySaleId(brandId, res) {
        try {
            const allfind = await this.modelsService.findByBrandId(brandId);
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
    async getByTypeModelId(typeModelId, res) {
        try {
            const allfind = await this.modelsService.findByTypeModelId(typeModelId);
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
    async findByBrandAuthorised(res) {
        try {
            const data = await this.modelsService.findByBrandAuthorised();
            return res.status(common_1.HttpStatus.OK).json({
                message: "Get Authorised Model successfuly !",
                status: common_1.HttpStatus.OK,
                data: data
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
            const comp = await this.modelsService.findAll();
            return res.status(common_1.HttpStatus.OK).json({
                message: "Models found successfuly !",
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
            const oneCompany = await this.modelsService.findOne(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "One model found successfuly !",
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
    async update(id, body, res, picture) {
        try {
            const updateModelDto = new update_model_dto_1.UpdateModelDto();
            updateModelDto.name = body.name;
            if (picture) {
                updateModelDto.picture = picture.filename;
            }
            else if (body.picture) {
                updateModelDto.picture = body.picture;
            }
            if (body.allpartIds) {
                updateModelDto.allpartIds = Array.isArray(body.allpartIds)
                    ? body.allpartIds
                    : JSON.parse(body.allpartIds);
            }
            if (body.brand)
                updateModelDto.brand = parseInt(body.brand);
            if (body.typeModel)
                updateModelDto.typeModel = parseInt(body.typeModel);
            const updatedata = await this.modelsService.update(id, updateModelDto);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Model updated successfuly !",
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
            const deletedata = await this.modelsService.remove(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Model deleted successfuly !",
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
exports.ModelsController = ModelsController;
__decorate([
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: "string" },
                picture: { type: "string", format: "binary" },
                typeModel: { type: "number" },
                brand: { type: "number" },
                allpartIds: {
                    type: "array",
                    items: { type: 'number', },
                }
            }
        }
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('picture', {
        storage: (0, multer_1.diskStorage)({
            destination: "./upload/models",
            filename: (_request, picture, callback) => callback(null, `${new Date().getTime()}-${picture.originalname}`)
        })
    })),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_model_dto_1.CreateModelDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/findByBrand/:brandId'),
    __param(0, (0, common_1.Param)('brandId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "getBySaleId", null);
__decorate([
    (0, common_1.Get)('/findByBrand/:typeModelId'),
    __param(0, (0, common_1.Param)('typeModelId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "getByTypeModelId", null);
__decorate([
    (0, common_1.Get)('findByBrandAuthorised'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "findByBrandAuthorised", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: "string" },
                picture: { type: "string", format: "binary" },
                brand: { type: "number" },
                typeModel: { type: "number" },
            }
        }
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('picture', {
        storage: (0, multer_1.diskStorage)({
            destination: "./upload/models",
            filename: (_request, picture, callback) => callback(null, `${new Date().getTime()}-${picture.originalname}`)
        })
    })),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "remove", null);
exports.ModelsController = ModelsController = __decorate([
    (0, common_1.Controller)('models'),
    __metadata("design:paramtypes", [models_service_1.ModelsService])
], ModelsController);
//# sourceMappingURL=models.controller.js.map