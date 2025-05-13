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
exports.DevicesController = void 0;
const common_1 = require("@nestjs/common");
const devices_service_1 = require("./devices.service");
const create_device_dto_1 = require("./dto/create-device.dto");
const update_device_dto_1 = require("./dto/update-device.dto");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
let DevicesController = class DevicesController {
    devicesService;
    constructor(devicesService) {
        this.devicesService = devicesService;
    }
    async create(createDeviceDto, res, warrentyProof) {
        try {
            createDeviceDto.warrentyProof = warrentyProof.filename;
            const newDevice = await this.devicesService.create(createDeviceDto);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: "Device created Successfuly !",
                status: common_1.HttpStatus.CREATED,
                data: newDevice
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
            const findAll = await this.devicesService.findAll();
            return res.status(common_1.HttpStatus.OK).json({
                message: "All Devices found successfuly !",
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
            const findOne = await this.devicesService.findOne(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "One device found successfuly !",
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
    async update(id, updateDeviceDto, res, warrentyProof) {
        try {
            updateDeviceDto.warrentyProof = warrentyProof?.filename;
            const updatedata = await this.devicesService.update(+id, updateDeviceDto);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Device updated successfuly !",
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
            const deletedata = await this.devicesService.remove(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Device deleted successfuly !",
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
    async getDevicesByCustomer(customerId, res) {
        try {
            const id = parseInt(customerId, 10);
            if (isNaN(id)) {
                throw new Error('Invalid customerId');
            }
            const devices = await this.devicesService.filterDevicesByCustomer(id);
            return res.status(common_1.HttpStatus.OK).json({
                message: 'Devices found successfully!',
                status: common_1.HttpStatus.OK,
                data: devices,
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
};
exports.DevicesController = DevicesController;
__decorate([
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                serialeNumber: { type: "string" },
                warrentyProof: { type: "string", format: "binary" },
                purchaseDate: { type: "Date" },
                model: { type: "number" },
                'customer[0]': {
                    type: 'number',
                    description: 'First permission',
                    example: 1,
                },
                'customer[1]': {
                    type: 'number',
                    description: 'First permission',
                    example: 1,
                },
                'customer[2]': {
                    type: 'number',
                    description: 'First permission',
                    example: 1,
                },
                'customer[3]': {
                    type: 'number',
                    description: 'First permission',
                    example: 1,
                },
            }
        }
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('warrentyProof', {
        storage: (0, multer_1.diskStorage)({
            destination: "./upload/devices",
            filename: (_request, warrentyProof, callback) => callback(null, `${new Date().getTime()}-${warrentyProof.originalname}`)
        })
    })),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_device_dto_1.CreateDeviceDto, Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                serialeNumber: { type: "string" },
                warrentyProof: { type: "string", format: "binary" },
                purchaseDate: { type: "Date" }
            }
        }
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('warrentyProof', {
        storage: (0, multer_1.diskStorage)({
            destination: "./upload/devices",
            filename: (_request, warrentyProof, callback) => callback(null, `${new Date().getTime()}-${warrentyProof.originalname}`)
        })
    })),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_device_dto_1.UpdateDeviceDto, Object, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('filter-by-customer/:customerId'),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getDevicesByCustomer", null);
exports.DevicesController = DevicesController = __decorate([
    (0, common_1.Controller)('devices'),
    __metadata("design:paramtypes", [devices_service_1.DevicesService])
], DevicesController);
//# sourceMappingURL=devices.controller.js.map