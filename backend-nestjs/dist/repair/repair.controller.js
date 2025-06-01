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
exports.RepairController = void 0;
const common_1 = require("@nestjs/common");
const repair_service_1 = require("./repair.service");
const create_repair_dto_1 = require("./dto/create-repair.dto");
const swagger_1 = require("@nestjs/swagger");
let RepairController = class RepairController {
    repairService;
    constructor(repairService) {
        this.repairService = repairService;
    }
    async create(body, createRepairDto, res) {
        try {
            const { userId, ...createRepairDto } = body;
            const newCreate = await this.repairService.create(createRepairDto, userId);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: 'Created Successfully!',
                status: common_1.HttpStatus.CREATED,
                data: newCreate,
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
    async findByBranchAndStep(branchId, step, res) {
        try {
            const allfind = await this.repairService.findByBranchAndStep(branchId, step);
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
    async findAll(res) {
        try {
            const allfind = await this.repairService.findAll();
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
            const onefind = await this.repairService.findOne(+id);
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
    async remove(id, res) {
        try {
            const deletedata = await this.repairService.remove(+id);
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
    async getRepairByDevice(deviceId, res) {
        try {
            const id = parseInt(deviceId, 10);
            if (isNaN(id)) {
                throw new Error('Invalid deviceId');
            }
            const devices = await this.repairService.filterRepairByDevice(id);
            return res.status(common_1.HttpStatus.OK).json({
                message: 'Repairs found successfully!',
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
    async getByNewSerialNumber(newSerialNumber, res) {
        try {
            const allfind = await this.repairService.filterByNewSerialNumber(newSerialNumber);
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
    async getByActuellyBranch(actuellyBranch, res) {
        try {
            const allfind = await this.repairService.filterByActuellyBranch(actuellyBranch);
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
    async getRepairByUser(userId, res) {
        try {
            const id = parseInt(userId, 10);
            if (isNaN(id)) {
                throw new Error('Invalid userId');
            }
            const user = await this.repairService.filterRepairByUser(id);
            return res.status(common_1.HttpStatus.OK).json({
                message: 'Repairs found successfully!',
                status: common_1.HttpStatus.OK,
                data: user,
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
exports.RepairController = RepairController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                actuellyBranch: { type: 'number' },
                remark: { type: 'string' },
                deviceStateReceive: { type: 'string' },
                device: { type: 'number' },
                'listFaultIds[0]': {
                    type: 'number',
                    description: 'First permission',
                    example: 1,
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_repair_dto_1.CreateRepairDto, Object]),
    __metadata("design:returntype", Promise)
], RepairController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('byBranchAndStep'),
    __param(0, (0, common_1.Query)('branchId')),
    __param(1, (0, common_1.Query)('step')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], RepairController.prototype, "findByBranchAndStep", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RepairController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RepairController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RepairController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('filter-by-device/:deviceId'),
    __param(0, (0, common_1.Param)('deviceId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RepairController.prototype, "getRepairByDevice", null);
__decorate([
    (0, common_1.Get)('/findByNewSerialNumber/:branchId'),
    __param(0, (0, common_1.Param)('newSerialNumber')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RepairController.prototype, "getByNewSerialNumber", null);
__decorate([
    (0, common_1.Get)('/findByActuellyBranch/:actuellyBranch'),
    __param(0, (0, common_1.Param)('actuellyBranch')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RepairController.prototype, "getByActuellyBranch", null);
__decorate([
    (0, common_1.Get)('filter-by-user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RepairController.prototype, "getRepairByUser", null);
exports.RepairController = RepairController = __decorate([
    (0, common_1.Controller)('repair'),
    __metadata("design:paramtypes", [repair_service_1.RepairService])
], RepairController);
//# sourceMappingURL=repair.controller.js.map