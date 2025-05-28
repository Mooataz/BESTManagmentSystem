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
const repair_service_1 = require("../repair/repair.service");
let PdfController = class PdfController {
    repairService;
    pdfService;
    constructor(repairService, pdfService) {
        this.repairService = repairService;
        this.pdfService = pdfService;
    }
    async generateRepairsPdf(id, res) {
        try {
            const repair = await this.repairService.findOne(id);
            if (!repair) {
                throw new common_1.NotFoundException('Réparation non trouvée');
            }
            const pdfBuffer = await this.pdfService.generatRepairPdf(repair);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="fiche_reparation.pdf"',
                'Content-Length': pdfBuffer.length
            });
            res.send(pdfBuffer);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                res.status(404).send(error.message);
            }
            else {
                res.status(500).send('Erreur lors de la génération du PDF');
            }
        }
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
], PdfController.prototype, "generateRepairsPdf", null);
exports.PdfController = PdfController = __decorate([
    (0, common_1.Controller)('pdf'),
    __metadata("design:paramtypes", [repair_service_1.RepairService,
        pdf_service_1.PdfService])
], PdfController);
//# sourceMappingURL=pdf.controller.js.map