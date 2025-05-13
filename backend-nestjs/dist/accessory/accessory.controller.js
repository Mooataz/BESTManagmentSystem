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
exports.AccessoryController = void 0;
const common_1 = require("@nestjs/common");
const accessory_service_1 = require("./accessory.service");
const create_accessory_dto_1 = require("./dto/create-accessory.dto");
const update_accessory_dto_1 = require("./dto/update-accessory.dto");
let AccessoryController = class AccessoryController {
    accessoryService;
    constructor(accessoryService) {
        this.accessoryService = accessoryService;
    }
    async create(createAccessoryDto, res) {
        try {
            const newcreate = await this.accessoryService.create(createAccessoryDto);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: "created Successfuly !",
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
            const allfind = await this.accessoryService.findAll();
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
            const onefind = await this.accessoryService.findOne(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "One  founded Successfuly !",
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
    async update(id, updateAccessoryDto, res) {
        try {
            const updatedata = await this.accessoryService.update(+id, updateAccessoryDto);
            return res.status(common_1.HttpStatus.OK).json({
                message: " updated Successfuly !",
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
            const deletedata = await this.accessoryService.remove(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: " deleted Successfuly !",
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
exports.AccessoryController = AccessoryController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_accessory_dto_1.CreateAccessoryDto, Object]),
    __metadata("design:returntype", Promise)
], AccessoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccessoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AccessoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_accessory_dto_1.UpdateAccessoryDto, Object]),
    __metadata("design:returntype", Promise)
], AccessoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AccessoryController.prototype, "remove", null);
exports.AccessoryController = AccessoryController = __decorate([
    (0, common_1.Controller)('accessory'),
    __metadata("design:paramtypes", [accessory_service_1.AccessoryService])
], AccessoryController);
//# sourceMappingURL=accessory.controller.js.map