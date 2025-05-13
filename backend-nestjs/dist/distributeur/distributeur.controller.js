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
exports.DistributeurController = void 0;
const common_1 = require("@nestjs/common");
const distributeur_service_1 = require("./distributeur.service");
const create_distributeur_dto_1 = require("./dto/create-distributeur.dto");
const update_distributeur_dto_1 = require("./dto/update-distributeur.dto");
let DistributeurController = class DistributeurController {
    distributeurService;
    constructor(distributeurService) {
        this.distributeurService = distributeurService;
    }
    async create(createDistributeurDto, res) {
        try {
            const newDistributeur = await this.distributeurService.create(createDistributeurDto);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: "Distributer created Successfuly !",
                status: common_1.HttpStatus.CREATED,
                data: newDistributeur
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
            const allDistributeurs = await this.distributeurService.findAll();
            return res.status(common_1.HttpStatus.OK).json({
                message: "Distributers found Successfuly !",
                status: common_1.HttpStatus.OK,
                data: allDistributeurs
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
            const OneDistributeur = await this.distributeurService.findOne(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Distributeur found Successfuly !",
                status: common_1.HttpStatus.OK,
                data: OneDistributeur
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
    async update(id, updateDistributeurDto, res) {
        try {
            const updatedata = await this.distributeurService.update(id, updateDistributeurDto);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Distributeur updated Successfuly !",
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
            const deletedata = await this.distributeurService.remove(+id);
            return res.status(common_1.HttpStatus.OK).json({
                message: "Distributeur deleted Successfuly !",
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
exports.DistributeurController = DistributeurController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_distributeur_dto_1.CreateDistributeurDto, Object]),
    __metadata("design:returntype", Promise)
], DistributeurController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DistributeurController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DistributeurController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_distributeur_dto_1.UpdateDistributeurDto, Object]),
    __metadata("design:returntype", Promise)
], DistributeurController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DistributeurController.prototype, "remove", null);
exports.DistributeurController = DistributeurController = __decorate([
    (0, common_1.Controller)('distributeur'),
    __metadata("design:paramtypes", [distributeur_service_1.DistributeurService])
], DistributeurController);
//# sourceMappingURL=distributeur.controller.js.map