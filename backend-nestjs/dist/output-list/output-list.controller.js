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
exports.OutputListController = void 0;
const common_1 = require("@nestjs/common");
const output_list_service_1 = require("./output-list.service");
const create_output_list_dto_1 = require("./dto/create-output-list.dto");
let OutputListController = class OutputListController {
    outputListService;
    constructor(outputListService) {
        this.outputListService = outputListService;
    }
    async create(createOutputListDto, res) {
        try {
            const newcreate = await this.outputListService.create(createOutputListDto);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: 'created Successfuly',
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
            const allfind = await this.outputListService.findAll();
            return res.status(common_1.HttpStatus.OK).json({
                message: " found successfuly !",
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
            const Onefind = await this.outputListService.findOne(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "One found successfuly !",
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
    async getByBranchId(branchId, res) {
        try {
            const allfind = await this.outputListService.findByBranchId(branchId);
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
    async getByCustomerId(customerId, res) {
        try {
            const allfind = await this.outputListService.findByCustomerId(customerId);
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
    async remove(id, res) {
        try {
            const deletedata = await this.outputListService.remove(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: " deleted successfuly !",
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
exports.OutputListController = OutputListController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_output_list_dto_1.CreateOutputListDto, Object]),
    __metadata("design:returntype", Promise)
], OutputListController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OutputListController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OutputListController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('/findByBranch/:branchId'),
    __param(0, (0, common_1.Param)('branchId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OutputListController.prototype, "getByBranchId", null);
__decorate([
    (0, common_1.Get)('/findByCustomer/:customerId'),
    __param(0, (0, common_1.Param)('customerId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OutputListController.prototype, "getByCustomerId", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OutputListController.prototype, "remove", null);
exports.OutputListController = OutputListController = __decorate([
    (0, common_1.Controller)('output-list'),
    __metadata("design:paramtypes", [output_list_service_1.OutputListService])
], OutputListController);
//# sourceMappingURL=output-list.controller.js.map