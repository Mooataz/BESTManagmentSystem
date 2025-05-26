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
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const repair_entity_1 = require("../repair/entities/repair.entity");
const typeorm_2 = require("typeorm");
const PDFDocument = require("pdfkit");
let PdfService = class PdfService {
    repairRepository;
    constructor(repairRepository) {
        this.repairRepository = repairRepository;
    }
    async generatRepairPdf(repairId) {
        const repair = await this.repairRepository.findOne({
            where: { id: repairId },
            relations: ['customer', 'device'],
        });
        if (!repair) {
            throw new Error('Réparation non trouvée');
        }
        const doc = new PDFDocument();
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.fontSize(25).text('Fiche de Réparation', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`ID: ${repair.id}`);
        doc.text(`Situè dans: ${repair.actuellyBranch}`);
        doc.text(`Statut: ${repair.deviceStateReceive}`);
        doc.moveDown();
        doc.fontSize(16).text('Description:');
        doc.fontSize(12).text(repair.remark);
        doc.moveDown();
        doc.fontSize(16).text('Client:');
        doc.fontSize(12).text(`Nom: ${repair.customer.name}`);
        doc.text(`Téléphone: ${repair.customer.phone}`);
        doc.moveDown();
        doc.fontSize(16).text('Appareil:');
        doc.fontSize(12).text(`Modèle: ${repair.device.model.name}`);
        doc.text(`Marque: ${repair.device.model.brand.name}`);
        doc.text(`S/N: ${repair.device.serialenumber}`);
        doc.end();
        return new Promise((resolve) => {
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
        });
    }
    create(createPdfDto) {
        return 'This action adds a new pdf';
    }
    findAll() {
        return `This action returns all pdf`;
    }
    findOne(id) {
        return `This action returns a #${id} pdf`;
    }
    update(id, updatePdfDto) {
        return `This action updates a #${id} pdf`;
    }
    remove(id) {
        return `This action removes a #${id} pdf`;
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(repair_entity_1.Repair)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PdfService);
//# sourceMappingURL=pdf.service.js.map