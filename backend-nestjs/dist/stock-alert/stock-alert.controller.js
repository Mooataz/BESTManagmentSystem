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
exports.StockAlertController = void 0;
const common_1 = require("@nestjs/common");
const stock_alert_service_1 = require("./stock-alert.service");
const pdf_service_1 = require("../pdf/pdf.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const branch_entity_1 = require("../branches/entities/branch.entity");
let StockAlertController = class StockAlertController {
    service;
    pdfService;
    branchRepo;
    constructor(service, pdfService, branchRepo) {
        this.service = service;
        this.pdfService = pdfService;
        this.branchRepo = branchRepo;
    }
    generateForBranch(branchId) {
        return this.service.generateAlertForBranch(Number(branchId));
    }
    generateAll() {
        return this.service.generateForAllBranches();
    }
    generateReception(branchId) {
        return this.service.generateReceptionAlertForBranch(Number(branchId));
    }
    generateReceptionAll() {
        return this.service.generateReceptionForAllBranches();
    }
    generateAffectation(branchId) {
        return this.service.generateAffectationAlertForBranch(Number(branchId));
    }
    generateAffectationAll() {
        return this.service.generateAffectationForAllBranches();
    }
    generateReparation(branchId) {
        return this.service.generateReparationAlertForBranch(Number(branchId));
    }
    generateReparationAll() {
        return this.service.generateReparationForAllBranches();
    }
    generateCq(branchId) {
        return this.service.generateCqAlertForBranch(Number(branchId));
    }
    generateCqAll() {
        return this.service.generateCqForAllBranches();
    }
    generateBloque(branchId) {
        return this.service.generateBloqueAlertForBranch(Number(branchId));
    }
    generateBloqueAll() {
        return this.service.generateBloqueForAllBranches();
    }
    async downloadPdf(id, branchId, res) {
        const alert = await this.service.findAlertById(Number(id));
        if (!alert)
            return res.status(404).send('Alerte introuvable');
        const branch = await this.branchRepo.findOneBy({ id: Number(branchId) });
        const safeName = (branch?.name ?? 'inconnue').replace(/[^a-zA-Z0-9_-]/g, '_');
        if (alert.type === 'reception') {
            const pdfBuffer = await this.pdfService.generateReceptionAlertPdf(Number(id), Number(branchId), alert.report);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Alert de reception ${safeName}.pdf"`,
                'Content-Length': pdfBuffer.length,
            });
            return res.send(pdfBuffer);
        }
        if (alert.type === 'affectation') {
            const pdfBuffer = await this.pdfService.generateAffectationAlertPdf(Number(id), Number(branchId), alert.report);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Alert d affectation ${safeName}.pdf"`,
                'Content-Length': pdfBuffer.length,
            });
            return res.send(pdfBuffer);
        }
        if (alert.type === 'reparation') {
            const pdfBuffer = await this.pdfService.generateReparationAlertPdf(Number(id), Number(branchId), alert.report);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Alert de reparation ${safeName}.pdf"`,
                'Content-Length': pdfBuffer.length,
            });
            return res.send(pdfBuffer);
        }
        if (alert.type === 'cq') {
            const pdfBuffer = await this.pdfService.generateCqAlertPdf(Number(id), Number(branchId), alert.report);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Alert CQ ${safeName}.pdf"`,
                'Content-Length': pdfBuffer.length,
            });
            return res.send(pdfBuffer);
        }
        if (alert.type === 'bloque') {
            const pdfBuffer = await this.pdfService.generateBloqueAlertPdf(Number(id), Number(branchId), alert.report);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Alert bloque ${safeName}.pdf"`,
                'Content-Length': pdfBuffer.length,
            });
            return res.send(pdfBuffer);
        }
        const pdfBuffer = await this.pdfService.generateStockAlertPdf(Number(id), Number(branchId), alert.report);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="Alert de stock ${safeName}.pdf"`,
            'Content-Length': pdfBuffer.length,
        });
        res.send(pdfBuffer);
    }
    getAlerts(branchId, userId) {
        return this.service.getAlerts(Number(branchId), Number(userId));
    }
    getAlertsByType(branchId, userId, type) {
        return this.service.getAlerts(Number(branchId), Number(userId), type);
    }
    markAsRead(id, userId) {
        return this.service.markAsRead(Number(id), Number(userId));
    }
};
exports.StockAlertController = StockAlertController;
__decorate([
    (0, common_1.Get)('generate/:branchId'),
    __param(0, (0, common_1.Param)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockAlertController.prototype, "generateForBranch", null);
__decorate([
    (0, common_1.Get)('generate-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockAlertController.prototype, "generateAll", null);
__decorate([
    (0, common_1.Get)('generate-reception/:branchId'),
    __param(0, (0, common_1.Param)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockAlertController.prototype, "generateReception", null);
__decorate([
    (0, common_1.Get)('generate-reception-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockAlertController.prototype, "generateReceptionAll", null);
__decorate([
    (0, common_1.Get)('generate-affectation/:branchId'),
    __param(0, (0, common_1.Param)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockAlertController.prototype, "generateAffectation", null);
__decorate([
    (0, common_1.Get)('generate-affectation-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockAlertController.prototype, "generateAffectationAll", null);
__decorate([
    (0, common_1.Get)('generate-reparation/:branchId'),
    __param(0, (0, common_1.Param)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockAlertController.prototype, "generateReparation", null);
__decorate([
    (0, common_1.Get)('generate-reparation-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockAlertController.prototype, "generateReparationAll", null);
__decorate([
    (0, common_1.Get)('generate-cq/:branchId'),
    __param(0, (0, common_1.Param)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockAlertController.prototype, "generateCq", null);
__decorate([
    (0, common_1.Get)('generate-cq-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockAlertController.prototype, "generateCqAll", null);
__decorate([
    (0, common_1.Get)('generate-bloque/:branchId'),
    __param(0, (0, common_1.Param)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockAlertController.prototype, "generateBloque", null);
__decorate([
    (0, common_1.Get)('generate-bloque-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockAlertController.prototype, "generateBloqueAll", null);
__decorate([
    (0, common_1.Get)(':id/pdf/:branchId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('branchId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], StockAlertController.prototype, "downloadPdf", null);
__decorate([
    (0, common_1.Get)(':branchId/:userId'),
    __param(0, (0, common_1.Param)('branchId')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StockAlertController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Get)(':branchId/:userId/:type'),
    __param(0, (0, common_1.Param)('branchId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StockAlertController.prototype, "getAlertsByType", null);
__decorate([
    (0, common_1.Patch)(':id/read/:userId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StockAlertController.prototype, "markAsRead", null);
exports.StockAlertController = StockAlertController = __decorate([
    (0, common_1.Controller)('apiApp/stock-alert'),
    __param(2, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __metadata("design:paramtypes", [stock_alert_service_1.StockAlertService,
        pdf_service_1.PdfService,
        typeorm_2.Repository])
], StockAlertController);
//# sourceMappingURL=stock-alert.controller.js.map