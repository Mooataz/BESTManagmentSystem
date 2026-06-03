"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartsPriceController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const parts_price_service_1 = require("./parts-price.service");
const ExcelJS = __importStar(require("exceljs"));
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
            if (error instanceof common_1.HttpException) {
                return res.status(error.getStatus()).json({
                    message: error.message,
                    status: error.getStatus(),
                    data: null,
                });
            }
            throw error;
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
            if (error instanceof common_1.HttpException) {
                return res.status(error.getStatus()).json({
                    message: error.message,
                    status: error.getStatus(),
                    data: null,
                });
            }
            throw error;
        }
    }
    async getViewData(branchId) {
        if (!branchId)
            throw new common_1.BadRequestException('branchId is required');
        return {
            message: 'View data found',
            status: common_1.HttpStatus.OK,
            data: await this.partsPriceService.getViewData(+branchId),
        };
    }
    async getAvailability() {
        return {
            message: 'Availability found',
            status: common_1.HttpStatus.OK,
            data: await this.partsPriceService.getAvailability(),
        };
    }
    async getReferences() {
        return {
            message: 'References found',
            status: common_1.HttpStatus.OK,
            data: await this.partsPriceService.getReferences(),
        };
    }
    async downloadTemplate(res) {
        const buffer = await this.partsPriceService.generateTemplate();
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="template_import_parts_price.xlsx"',
        });
        res.send(buffer);
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
            if (error instanceof common_1.HttpException) {
                return res.status(error.getStatus()).json({
                    message: error.message,
                    status: error.getStatus(),
                    data: null,
                });
            }
            throw error;
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
            if (error instanceof common_1.HttpException) {
                return res.status(error.getStatus()).json({
                    message: error.message,
                    status: error.getStatus(),
                    data: null,
                });
            }
            throw error;
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
            if (error instanceof common_1.HttpException) {
                return res.status(error.getStatus()).json({
                    message: error.message,
                    status: error.getStatus(),
                    data: null,
                });
            }
            throw error;
        }
    }
    async importExcel(file, req, res) {
        try {
            let rows;
            if (file) {
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(file.buffer);
                const worksheet = workbook.worksheets[0];
                if (!worksheet)
                    throw new common_1.BadRequestException('Aucune feuille trouvée');
                rows = [];
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber === 1)
                        return;
                    rows.push({
                        brandName: (row.getCell(1).value ?? '').toString().trim(),
                        modelName: (row.getCell(2).value ?? '').toString().trim(),
                        allPartDescription: (row.getCell(3).value ?? '').toString().trim(),
                        price: parseFloat((row.getCell(4).value ?? '0').toString().trim()),
                        levelRepairName: (row.getCell(5).value ?? '').toString().trim() || undefined,
                    });
                });
            }
            else if (req.body && Array.isArray(req.body.rows)) {
                rows = req.body.rows;
            }
            else {
                throw new common_1.BadRequestException('Aucune donnée valide (fichier ou body.rows)');
            }
            const result = await this.partsPriceService.importExcel(rows);
            return res.status(common_1.HttpStatus.OK).json({
                message: `${result.imported} ligne(s) importée(s)`,
                status: common_1.HttpStatus.OK,
                data: result,
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.BadRequestException('Import invalide');
        }
    }
    async getDevisInfo(body, res) {
        try {
            const parts = await this.partsPriceService.findByModelAndPartIds(body.modelId, body.partIds);
            const { tva, timbreFiscale } = await this.partsPriceService.getCompanyTvaTimbre();
            return res.status(common_1.HttpStatus.OK).json({
                message: 'Devis info found successfully !',
                status: common_1.HttpStatus.OK,
                data: { parts, tva, timbreFiscale }
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw error;
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
            if (error instanceof common_1.HttpException) {
                return res.status(error.getStatus()).json({
                    message: error.message,
                    status: error.getStatus(),
                    data: null,
                });
            }
            throw error;
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
    (0, common_1.Get)('view-data'),
    __param(0, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PartsPriceController.prototype, "getViewData", null);
__decorate([
    (0, common_1.Get)('availability'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PartsPriceController.prototype, "getAvailability", null);
__decorate([
    (0, common_1.Get)('references'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PartsPriceController.prototype, "getReferences", null);
__decorate([
    (0, common_1.Get)('template'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PartsPriceController.prototype, "downloadTemplate", null);
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
    (0, common_1.Post)('import'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PartsPriceController.prototype, "importExcel", null);
__decorate([
    (0, common_1.Post)('devis-info'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PartsPriceController.prototype, "getDevisInfo", null);
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