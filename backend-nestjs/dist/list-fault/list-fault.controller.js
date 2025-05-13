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
exports.ListFaultController = void 0;
const common_1 = require("@nestjs/common");
const list_fault_service_1 = require("./list-fault.service");
const create_list_fault_dto_1 = require("./dto/create-list-fault.dto");
const update_list_fault_dto_1 = require("./dto/update-list-fault.dto");
let ListFaultController = class ListFaultController {
    listFaultService;
    constructor(listFaultService) {
        this.listFaultService = listFaultService;
    }
    async create(createListFaultDto, res) {
        try {
            const newcreate = await this.listFaultService.create(createListFaultDto);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: "Created Successfuly !",
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
            const allfind = await this.listFaultService.findAll();
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
    async findOne(id, res) {
        try {
            const Onefind = await this.listFaultService.findOne(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Founded Successfuly !",
                status: common_1.HttpStatus.OK,
                data: Onefind
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
    async update(id, updateListFaultDto, res) {
        try {
            const updatedata = await this.listFaultService.update(+id, updateListFaultDto);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Updated Successfuly !",
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
            const deletedata = await this.listFaultService.remove(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Deleted Successfuly !",
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
exports.ListFaultController = ListFaultController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_list_fault_dto_1.CreateListFaultDto, Object]),
    __metadata("design:returntype", Promise)
], ListFaultController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListFaultController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ListFaultController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_list_fault_dto_1.UpdateListFaultDto, Object]),
    __metadata("design:returntype", Promise)
], ListFaultController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ListFaultController.prototype, "remove", null);
exports.ListFaultController = ListFaultController = __decorate([
    (0, common_1.Controller)('list-fault'),
    __metadata("design:paramtypes", [list_fault_service_1.ListFaultService])
], ListFaultController);
//# sourceMappingURL=list-fault.controller.js.map