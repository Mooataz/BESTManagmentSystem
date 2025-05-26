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
exports.PdfController = void 0;
const common_1 = require("@nestjs/common");
const pdf_service_1 = require("./pdf.service");
const create_pdf_dto_1 = require("./dto/create-pdf.dto");
const update_pdf_dto_1 = require("./dto/update-pdf.dto");
let PdfController = class PdfController {
    pdfService;
    constructor(pdfService) {
        this.pdfService = pdfService;
    }
    async generateRepairPdf(id, res) {
        try {
            console.log('id: ', id);
            const pdfBuffer = await this.pdfService.generatRepairPdf(id);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=fiche_reparation.pdf',
            });
            res.send(pdfBuffer);
        }
        catch (error) {
            res.status(404).send(error.message);
        }
    }
    create(createPdfDto) {
        return this.pdfService.create(createPdfDto);
    }
    findAll() {
        return this.pdfService.findAll();
    }
    findOne(id) {
        return this.pdfService.findOne(+id);
    }
    update(id, updatePdfDto) {
        return this.pdfService.update(+id, updatePdfDto);
    }
    remove(id) {
        return this.pdfService.remove(+id);
    }
};
exports.PdfController = PdfController;
__decorate([
    (0, common_1.Get)('repair/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PdfController.prototype, "generateRepairPdf", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pdf_dto_1.CreatePdfDto]),
    __metadata("design:returntype", void 0)
], PdfController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PdfController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PdfController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pdf_dto_1.UpdatePdfDto]),
    __metadata("design:returntype", void 0)
], PdfController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PdfController.prototype, "remove", null);
exports.PdfController = PdfController = __decorate([
    (0, common_1.Controller)('pdf'),
    __metadata("design:paramtypes", [pdf_service_1.PdfService])
], PdfController);
//# sourceMappingURL=pdf.controller.js.map