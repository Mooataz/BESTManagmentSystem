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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const repair_entity_1 = require("../repair/entities/repair.entity");
const company_entity_1 = require("../company/entities/company.entity");
const legislation_entity_1 = require("../legislation/entities/legislation.entity");
const branch_entity_1 = require("../branches/entities/branch.entity");
let PdfService = class PdfService {
    companyRepository;
    legislationRepository;
    repairRepository;
    branchRepository;
    constructor(companyRepository, legislationRepository, repairRepository, branchRepository) {
        this.companyRepository = companyRepository;
        this.legislationRepository = legislationRepository;
        this.repairRepository = repairRepository;
        this.branchRepository = branchRepository;
    }
    async generatRepairPdf(repair) {
        if (!repair?.device?.model) {
            throw new common_1.BadRequestException('Repair device or model missing');
        }
        const doc = new pdfkit_1.default({ margin: 15, size: 'A4' });
        const buffers = [];
        doc.on('data', (b) => buffers.push(b));
        const firstHistory = repair.historyRepair?.[0];
        const firstTrace = firstHistory?.tracability?.[0];
        const branch = firstTrace?.user?.branch;
        const company = branch?.company?.id
            ? await this.companyRepository.findOne({ where: { id: branch.company.id } })
            : null;
        const model = repair.device.model;
        const brand = model?.brand;
        const customer = repair.customer;
        const distributer = customer?.distributer;
        const legislations = await this.legislationRepository.find();
        const previousRepairs = repair.device?.serialenumber
            ? await this.repairRepository.find({
                where: { device: { serialenumber: repair.device.serialenumber } },
                relations: ['historyRepair', 'historyRepair.tracability', 'historyRepair.tracability.user'],
            })
            : [];
        const filteredPrevious = previousRepairs.filter(r => r.id !== repair.id);
        const safeDateTime = (d) => d
            ? new Date(d).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
            : 'N/A';
        const pageWidth = doc.page.width - 30;
        const ml = 15;
        const fsN = 7;
        const fsS = 6.5;
        const tryImage = (filePath, x, y, w) => {
            try {
                if (fs.existsSync(filePath)) {
                    doc.image(filePath, x, y, { width: w });
                    return true;
                }
            }
            catch { }
            return false;
        };
        const drawSection = (y0, isSociete, title) => {
            let y = y0;
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#135188')
                .text(title, ml, y, { width: pageWidth, align: 'center' });
            y += 12;
            const logoSize = 30;
            if (company?.logo) {
                const p = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
                tryImage(p, ml, y, logoSize);
            }
            if (brand?.logo) {
                const p = path.join(__dirname, '..', '..', 'upload', 'brands', brand.logo);
                tryImage(p, ml + pageWidth - logoSize, y, logoSize);
            }
            y += logoSize + 6;
            const bx = ml;
            const by = y;
            const bw = pageWidth;
            const colW = (bw - 10) / 3;
            const c1x = bx + 5;
            const c2x = bx + 5 + colW + 5;
            const c3x = bx + 5 + 2 * (colW + 5);
            let c1y = by + 5;
            doc.fontSize(fsN).font('Helvetica-Bold').text('Réparation:', c1x, c1y);
            c1y += 9;
            doc.font('Helvetica');
            [
                `N°: ${repair.id}`,
                `Date: ${safeDateTime(firstHistory?.date)}`,
                `Étape: ${firstHistory?.step ?? '-'}`,
                `Technicien: ${firstTrace?.user?.name ?? '-'}`,
                `Agence: ${branch?.name ?? '-'}`,
                `Tél agence: ${branch?.phone?.toString() ?? '-'}`,
            ].forEach(t => { doc.text(t, c1x + 3, c1y); c1y += 7; });
            let c2y = by + 5;
            doc.font('Helvetica-Bold').text('Appareil:', c2x, c2y);
            c2y += 9;
            doc.font('Helvetica');
            [
                `N° série: ${repair.device?.serialenumber ?? '-'}`,
                `Marque: ${brand?.name ?? '-'}`,
                `Modèle: ${model?.name ?? '-'}`,
                `Type: ${model?.typeModel?.description ?? '-'}`,
                `État reçu: ${repair.deviceStateReceive ?? '-'}`,
            ].forEach(t => { doc.text(t, c2x + 3, c2y); c2y += 7; });
            let c3y = by + 5;
            doc.font('Helvetica-Bold').text('Client:', c3x, c3y);
            c3y += 9;
            doc.font('Helvetica');
            [
                `Nom: ${customer?.name ?? '-'}`,
                `Tél: ${customer?.phone?.toString() ?? '-'}`,
                `Distributeur: ${distributer?.name ?? '-'}`,
            ].forEach(t => { doc.text(t, c3x + 3, c3y); c3y += 7; });
            const boxEnd = Math.max(c1y, c2y, c3y, by + 50);
            doc.rect(bx, by, bw, boxEnd - by).stroke();
            y = boxEnd + 4;
            doc.fontSize(fsN).font('Helvetica-Bold').text('Accessoires:', bx + 5, y);
            doc.font('Helvetica');
            const acc = repair.accessory?.length ? repair.accessory.map(a => a.name).join(', ') : 'Aucun';
            doc.text(acc, bx + 62, y, { width: pageWidth - 80 });
            y += 10;
            doc.font('Helvetica-Bold').text('Pannes:', bx + 5, y);
            doc.font('Helvetica');
            const flt = repair.listFault?.length ? repair.listFault.map(f => f.name).join(', ') : 'Aucune';
            doc.text(flt, bx + 42, y, { width: pageWidth - 60 });
            y += 10;
            doc.font('Helvetica-Bold').text('Demandes client:', bx + 5, y);
            doc.font('Helvetica');
            const req = repair.customerRequest?.length ? repair.customerRequest.map(r => r.name).join(', ') : 'Aucune';
            doc.text(req, bx + 82, y, { width: pageWidth - 100 });
            y += 10;
            if (isSociete && filteredPrevious.length > 0) {
                y += 2;
                doc.font('Helvetica-Bold').fontSize(fsN).fillColor('#135188')
                    .text('Réparations antérieures:', bx + 5, y);
                y += 8;
                doc.font('Helvetica').fillColor('black').fontSize(fsS);
                filteredPrevious.slice(0, 5).forEach((prev, i) => {
                    const ph = prev.historyRepair?.[0];
                    const pt = ph?.tracability?.[0];
                    doc.text(`${i + 1}. N°${prev.id} - ${safeDateTime(ph?.date)} - ${ph?.step ?? '-'} (${pt?.user?.name ?? '-'})`, bx + 10, y);
                    y += 7;
                });
                y += 2;
            }
            if (!isSociete) {
                y += 2;
                doc.font('Helvetica-Bold').fontSize(fsN).fillColor('#135188')
                    .text('Législations:', bx + 5, y);
                y += 8;
                doc.font('Helvetica').fillColor('black').fontSize(fsS);
                const nCol = 3;
                const cw = (bw - 30) / nCol;
                const legRows = Math.ceil(legislations.length / nCol);
                legislations.forEach((leg, i) => {
                    const col = i % nCol;
                    const row = Math.floor(i / nCol);
                    doc.text(`☐ ${leg.name}`, bx + 10 + col * cw, y + row * 7, { width: cw - 5 });
                });
                y += legRows * 7 + 6;
                doc.font('Helvetica-Bold').fontSize(fsN).fillColor('#135188')
                    .text('Société / Agence:', bx + 5, y);
                y += 8;
                doc.font('Helvetica').fillColor('black').fontSize(fsS);
                [
                    `Société: ${company?.name ?? '-'}`,
                    `Adresse: ${company?.headquarterslocation ?? '-'}`,
                    `N° fiscal: ${company?.taxRegisterNumber ?? '-'}`,
                    `RIB: ${company?.rib?.toString() ?? '-'}`,
                    `Banque: ${company?.bank ?? '-'}`,
                    `Agence: ${branch?.name ?? '-'}`,
                ].forEach(t => { doc.text(t, bx + 10, y); y += 7; });
                y += 3;
                doc.fontSize(fsS).font('Helvetica')
                    .text('Signature client:', bx + 5, y);
                doc.moveTo(bx + 65, y + 3).lineTo(bx + 180, y + 3).stroke();
                y += 10;
            }
            return y;
        };
        const endY1 = drawSection(15, false, 'COPIE CLIENT');
        const sepY = endY1 + 4;
        doc.moveTo(ml, sepY).lineTo(ml + pageWidth, sepY).stroke('#CCCCCC');
        drawSection(sepY + 4, true, 'COPIE SOCIÉTÉ');
        doc.fontSize(6).fillColor('gray')
            .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, ml, doc.page.height - 16, { align: 'right' });
        doc.end();
        return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(buffers))));
    }
    drawTwoColumnBox(doc, x, y, width, title, items) {
        const colWidth = width / 2 - 10;
        const lineHeight = 10;
        doc.rect(x, y, width, 70).stroke();
        doc.font('Helvetica-Bold').fontSize(8).text(title, x, y + 5, { width, align: 'center' });
        doc.font('Helvetica').fontSize(7);
        items.forEach((item, i) => {
            const colX = i % 2 === 0 ? x + 5 : x + colWidth + 15;
            const rowY = y + 20 + Math.floor(i / 2) * lineHeight;
            doc.text(`• ${item}`, colX, rowY, { width: colWidth });
        });
    }
    async generateStockReport(branchId, parts) {
        if (!parts.length) {
            throw new common_1.BadRequestException('No stock data provided');
        }
        const uploadDir = path.join(__dirname, '..', '..', 'uploads');
        fs.mkdirSync(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, `stock-${branchId}.pdf`);
        const doc = new pdfkit_1.default();
        doc.pipe(fs.createWriteStream(filePath));
        doc.fontSize(18).text('Rapport de Stock Critique', { align: 'center' });
        doc.moveDown();
        parts.forEach((p, i) => {
            doc.text(`${i + 1}. ${p.modelName} - ${p.partName} (${p.count} unités)`);
        });
        doc.end();
        return filePath;
    }
    async generateStockAlertPdf(alertId, branchId, report) {
        const branch = await this.branchRepository.findOne({
            where: { id: branchId },
            relations: ['company'],
        });
        const company = branch?.company?.id
            ? await this.companyRepository.findOne({ where: { id: branch.company.id } })
            : null;
        const doc = new pdfkit_1.default({ margin: 30, size: 'A4' });
        const buffers = [];
        doc.on('data', (b) => buffers.push(b));
        const pageWidth = doc.page.width - 60;
        let y = 30;
        if (company?.logo) {
            const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
            try {
                if (fs.existsSync(logoPath)) {
                    doc.image(logoPath, 30, y, { width: 60 });
                }
            }
            catch { }
        }
        doc.font('Helvetica-Bold').fontSize(16).fillColor('#135188')
            .text('Rapport d\'Alerte Stock', 30, y + 10, { align: 'center', width: pageWidth });
        y += 30;
        doc.font('Helvetica').fontSize(9).fillColor('black');
        doc.text(`Agence: ${branch?.name ?? '-'}`, 30, y);
        y += 12;
        doc.text(`Date: ${new Date().toLocaleString('fr-FR')}`, 30, y);
        y += 20;
        const colX = [30, 150, 300, 450];
        const colW = [110, 140, 140, 80];
        const headers = ['Marque', 'Modèle', 'Pièce', 'Quantité'];
        const rowH = 16;
        doc.rect(30, y, pageWidth, rowH).fill('#135188');
        doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
        headers.forEach((h, i) => {
            doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 });
        });
        y += rowH;
        doc.font('Helvetica').fontSize(8).fillColor('black');
        report.forEach((item, i) => {
            if (y + rowH > doc.page.height - 40) {
                doc.addPage();
                y = 30;
                doc.rect(30, y, pageWidth, rowH).fill('#135188');
                doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
                headers.forEach((h, i) => {
                    doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 });
                });
                y += rowH;
                doc.font('Helvetica').fontSize(8).fillColor('black');
            }
            const bgColor = i % 2 === 0 ? '#F5F5F5' : 'white';
            doc.rect(30, y, pageWidth, rowH).fill(bgColor);
            doc.fillColor('black');
            doc.text(item.brand, colX[0] + 4, y + 4, { width: colW[0] - 8 });
            doc.text(item.model, colX[1] + 4, y + 4, { width: colW[1] - 8 });
            doc.text(item.part, colX[2] + 4, y + 4, { width: colW[2] - 8 });
            doc.text(String(item.quantity), colX[3] + 4, y + 4, { width: colW[3] - 8 });
            y += rowH;
        });
        y += 10;
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#135188')
            .text(`Total: ${report.length} pièce(s) sous le seuil d'alerte`, 30, y);
        doc.font('Helvetica').fontSize(7).fillColor('gray')
            .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 30, doc.page.height - 20, { align: 'right' });
        doc.end();
        return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(buffers))));
    }
    async generateReceptionAlertPdf(alertId, branchId, report) {
        const branch = await this.branchRepository.findOne({
            where: { id: branchId },
            relations: ['company'],
        });
        const company = branch?.company?.id
            ? await this.companyRepository.findOne({ where: { id: branch.company.id } })
            : null;
        const doc = new pdfkit_1.default({ margin: 30, size: 'A4' });
        const buffers = [];
        doc.on('data', (b) => buffers.push(b));
        const pageWidth = doc.page.width - 60;
        let y = 30;
        if (company?.logo) {
            const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
            try {
                if (fs.existsSync(logoPath))
                    doc.image(logoPath, 30, y, { width: 60 });
            }
            catch { }
        }
        doc.font('Helvetica-Bold').fontSize(16).fillColor('#135188')
            .text('Rapport d\'Alerte Réception', 30, y + 10, { align: 'center', width: pageWidth });
        y += 30;
        doc.font('Helvetica').fontSize(9).fillColor('black');
        doc.text(`Agence: ${branch?.name ?? '-'}`, 30, y);
        y += 12;
        doc.text(`Date: ${new Date().toLocaleString('fr-FR')}`, 30, y);
        y += 12;
        doc.text(`Réparations en Création: ${report.length}`, 30, y);
        y += 20;
        const colX = [30, 130, 260, 380];
        const colW = [90, 120, 120, 120];
        const headers = ['N° Réparation', 'Client', 'Modèle', 'N° Série'];
        const rowH = 16;
        doc.rect(30, y, pageWidth, rowH).fill('#135188');
        doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
        headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
        y += rowH;
        doc.font('Helvetica').fontSize(8).fillColor('black');
        report.forEach((item, i) => {
            if (y + rowH > doc.page.height - 40) {
                doc.addPage();
                y = 30;
                doc.rect(30, y, pageWidth, rowH).fill('#135188');
                doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
                headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
                y += rowH;
                doc.font('Helvetica').fontSize(8).fillColor('black');
            }
            const bgColor = i % 2 === 0 ? '#F5F5F5' : 'white';
            doc.rect(30, y, pageWidth, rowH).fill(bgColor);
            doc.fillColor('black');
            doc.text(String(item.repairId), colX[0] + 4, y + 4, { width: colW[0] - 8 });
            doc.text(item.customerName, colX[1] + 4, y + 4, { width: colW[1] - 8 });
            doc.text(item.deviceModel, colX[2] + 4, y + 4, { width: colW[2] - 8 });
            doc.text(item.serialNumber, colX[3] + 4, y + 4, { width: colW[3] - 8 });
            y += rowH;
        });
        y += 10;
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#135188')
            .text(`Total: ${report.length} réparation(s) bloquée(s) en Création`, 30, y);
        doc.font('Helvetica').fontSize(7).fillColor('gray')
            .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 30, doc.page.height - 20, { align: 'right' });
        doc.end();
        return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(buffers))));
    }
    async generateAffectationAlertPdf(alertId, branchId, report) {
        const branch = await this.branchRepository.findOne({
            where: { id: branchId },
            relations: ['company'],
        });
        const company = branch?.company?.id
            ? await this.companyRepository.findOne({ where: { id: branch.company.id } })
            : null;
        const doc = new pdfkit_1.default({ margin: 30, size: 'A4' });
        const buffers = [];
        doc.on('data', (b) => buffers.push(b));
        const pageWidth = doc.page.width - 60;
        let y = 30;
        if (company?.logo) {
            const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
            try {
                if (fs.existsSync(logoPath))
                    doc.image(logoPath, 30, y, { width: 60 });
            }
            catch { }
        }
        doc.font('Helvetica-Bold').fontSize(16).fillColor('#135188')
            .text('Rapport d\'Alerte Affectation', 30, y + 10, { align: 'center', width: pageWidth });
        y += 30;
        doc.font('Helvetica').fontSize(9).fillColor('black');
        doc.text(`Agence: ${branch?.name ?? '-'}`, 30, y);
        y += 12;
        doc.text(`Date: ${new Date().toLocaleString('fr-FR')}`, 30, y);
        y += 12;
        doc.text(`Réparations en Affectation: ${report.length}`, 30, y);
        y += 20;
        const colX = [30, 130, 260, 380];
        const colW = [90, 120, 120, 120];
        const headers = ['N° Réparation', 'Client', 'Modèle', 'N° Série'];
        const rowH = 16;
        doc.rect(30, y, pageWidth, rowH).fill('#135188');
        doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
        headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
        y += rowH;
        doc.font('Helvetica').fontSize(8).fillColor('black');
        report.forEach((item, i) => {
            if (y + rowH > doc.page.height - 40) {
                doc.addPage();
                y = 30;
                doc.rect(30, y, pageWidth, rowH).fill('#135188');
                doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
                headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
                y += rowH;
                doc.font('Helvetica').fontSize(8).fillColor('black');
            }
            const bgColor = i % 2 === 0 ? '#F5F5F5' : 'white';
            doc.rect(30, y, pageWidth, rowH).fill(bgColor);
            doc.fillColor('black');
            doc.text(String(item.repairId), colX[0] + 4, y + 4, { width: colW[0] - 8 });
            doc.text(item.customerName, colX[1] + 4, y + 4, { width: colW[1] - 8 });
            doc.text(item.deviceModel, colX[2] + 4, y + 4, { width: colW[2] - 8 });
            doc.text(item.serialNumber, colX[3] + 4, y + 4, { width: colW[3] - 8 });
            y += rowH;
        });
        y += 10;
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#135188')
            .text(`Total: ${report.length} réparation(s) bloquée(s) en Affectation`, 30, y);
        doc.font('Helvetica').fontSize(7).fillColor('gray')
            .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 30, doc.page.height - 20, { align: 'right' });
        doc.end();
        return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(buffers))));
    }
    async generateReparationAlertPdf(alertId, branchId, report) {
        const branch = await this.branchRepository.findOne({
            where: { id: branchId },
            relations: ['company'],
        });
        const company = branch?.company?.id
            ? await this.companyRepository.findOne({ where: { id: branch.company.id } })
            : null;
        const doc = new pdfkit_1.default({ margin: 30, size: 'A4' });
        const buffers = [];
        doc.on('data', (b) => buffers.push(b));
        const pageWidth = doc.page.width - 60;
        let y = 30;
        if (company?.logo) {
            const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
            try {
                if (fs.existsSync(logoPath))
                    doc.image(logoPath, 30, y, { width: 60 });
            }
            catch { }
        }
        doc.font('Helvetica-Bold').fontSize(16).fillColor('#135188')
            .text('Rapport d\'Alerte Réparation', 30, y + 10, { align: 'center', width: pageWidth });
        y += 30;
        doc.font('Helvetica').fontSize(9).fillColor('black');
        doc.text(`Agence: ${branch?.name ?? '-'}`, 30, y);
        y += 12;
        doc.text(`Date: ${new Date().toLocaleString('fr-FR')}`, 30, y);
        y += 12;
        doc.text(`Réparations en cours: ${report.length}`, 30, y);
        y += 20;
        const colX = [30, 130, 260, 380];
        const colW = [90, 120, 120, 120];
        const headers = ['N° Réparation', 'Client', 'Modèle', 'N° Série'];
        const rowH = 16;
        doc.rect(30, y, pageWidth, rowH).fill('#135188');
        doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
        headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
        y += rowH;
        doc.font('Helvetica').fontSize(8).fillColor('black');
        report.forEach((item, i) => {
            if (y + rowH > doc.page.height - 40) {
                doc.addPage();
                y = 30;
                doc.rect(30, y, pageWidth, rowH).fill('#135188');
                doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
                headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
                y += rowH;
                doc.font('Helvetica').fontSize(8).fillColor('black');
            }
            const bgColor = i % 2 === 0 ? '#F5F5F5' : 'white';
            doc.rect(30, y, pageWidth, rowH).fill(bgColor);
            doc.fillColor('black');
            doc.text(String(item.repairId), colX[0] + 4, y + 4, { width: colW[0] - 8 });
            doc.text(item.customerName, colX[1] + 4, y + 4, { width: colW[1] - 8 });
            doc.text(item.deviceModel, colX[2] + 4, y + 4, { width: colW[2] - 8 });
            doc.text(item.serialNumber, colX[3] + 4, y + 4, { width: colW[3] - 8 });
            y += rowH;
        });
        y += 10;
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#135188')
            .text(`Total: ${report.length} réparation(s) en attente`, 30, y);
        doc.font('Helvetica').fontSize(7).fillColor('gray')
            .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 30, doc.page.height - 20, { align: 'right' });
        doc.end();
        return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(buffers))));
    }
    async generateCqAlertPdf(alertId, branchId, report) {
        const branch = await this.branchRepository.findOne({
            where: { id: branchId },
            relations: ['company'],
        });
        const company = branch?.company?.id
            ? await this.companyRepository.findOne({ where: { id: branch.company.id } })
            : null;
        const doc = new pdfkit_1.default({ margin: 30, size: 'A4' });
        const buffers = [];
        doc.on('data', (b) => buffers.push(b));
        const pageWidth = doc.page.width - 60;
        let y = 30;
        if (company?.logo) {
            const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
            try {
                if (fs.existsSync(logoPath))
                    doc.image(logoPath, 30, y, { width: 60 });
            }
            catch { }
        }
        doc.font('Helvetica-Bold').fontSize(16).fillColor('#135188')
            .text('Rapport d\'Alerte CQ', 30, y + 10, { align: 'center', width: pageWidth });
        y += 30;
        doc.font('Helvetica').fontSize(9).fillColor('black');
        doc.text(`Agence: ${branch?.name ?? '-'}`, 30, y);
        y += 12;
        doc.text(`Date: ${new Date().toLocaleString('fr-FR')}`, 30, y);
        y += 12;
        doc.text(`Réparations en CQ: ${report.length}`, 30, y);
        y += 20;
        const colX = [30, 130, 260, 380];
        const colW = [90, 120, 120, 120];
        const headers = ['N° Réparation', 'Client', 'Modèle', 'N° Série'];
        const rowH = 16;
        doc.rect(30, y, pageWidth, rowH).fill('#135188');
        doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
        headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
        y += rowH;
        doc.font('Helvetica').fontSize(8).fillColor('black');
        report.forEach((item, i) => {
            if (y + rowH > doc.page.height - 40) {
                doc.addPage();
                y = 30;
                doc.rect(30, y, pageWidth, rowH).fill('#135188');
                doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
                headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
                y += rowH;
                doc.font('Helvetica').fontSize(8).fillColor('black');
            }
            const bgColor = i % 2 === 0 ? '#F5F5F5' : 'white';
            doc.rect(30, y, pageWidth, rowH).fill(bgColor);
            doc.fillColor('black');
            doc.text(String(item.repairId), colX[0] + 4, y + 4, { width: colW[0] - 8 });
            doc.text(item.customerName, colX[1] + 4, y + 4, { width: colW[1] - 8 });
            doc.text(item.deviceModel, colX[2] + 4, y + 4, { width: colW[2] - 8 });
            doc.text(item.serialNumber, colX[3] + 4, y + 4, { width: colW[3] - 8 });
            y += rowH;
        });
        y += 10;
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#135188')
            .text(`Total: ${report.length} réparation(s) bloquée(s) en CQ`, 30, y);
        doc.font('Helvetica').fontSize(7).fillColor('gray')
            .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 30, doc.page.height - 20, { align: 'right' });
        doc.end();
        return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(buffers))));
    }
    async generateStockPartTicketPdf(stockParts) {
        const doc = new pdfkit_1.default({ margin: 15, size: 'A4' });
        const buffers = [];
        doc.on('data', (b) => buffers.push(b));
        const pageWidth = doc.page.width - 30;
        const cols = 3;
        const gap = 6;
        const colW = (pageWidth - gap * (cols - 1)) / cols;
        const labelW = 58;
        const valXOff = labelW + 2;
        const lineH = 9;
        const headerH = 14;
        const padd = 4;
        const ticketH = headerH + 11 * lineH + padd * 2;
        const colX = [];
        for (let i = 0; i < cols; i++) {
            colX.push(15 + i * (colW + gap));
        }
        const ticketsPerPage = 12;
        const rowsPerPage = Math.floor(ticketsPerPage / cols);
        for (let idx = 0; idx < stockParts.length; idx++) {
            const sp = stockParts[idx];
            const pageIdx = Math.floor(idx / ticketsPerPage);
            const posInPage = idx % ticketsPerPage;
            const col = posInPage % cols;
            const row = Math.floor(posInPage / cols);
            if (posInPage === 0 && pageIdx > 0) {
                doc.addPage();
            }
            const x = colX[col];
            const y = 15 + row * (ticketH + gap);
            const branch = sp.bin?.branch;
            const fieldRows = [
                ['ID:', String(sp.id)],
                ['N° Série:', sp.serialNumber ?? '-'],
                ['Casier:', sp.bin?.name ?? '-'],
                ['Type Casier:', sp.bin?.type ?? '-'],
                ['Agence:', branch?.name ?? '-'],
                ['Code Matière:', sp.reference?.materialCode ?? '-'],
                ['Description:', sp.reference?.description ?? '-'],
                ['Marque:', sp.reference?.model?.[0]?.brand?.name ?? '-'],
                ['Type Modèle:', sp.reference?.model?.[0]?.typeModel?.description ?? '-'],
                ['Modèle:', sp.reference?.model?.[0]?.name ?? '-'],
                ['Pièce:', sp.reference?.allpart?.description ?? '-'],
            ];
            doc.rect(x, y, colW, ticketH).stroke('#333');
            doc.font('Helvetica-Bold').fontSize(6).fillColor('#135188');
            fieldRows.forEach(([label], i) => {
                doc.text(label, x + padd, y + headerH + i * lineH, { width: labelW });
            });
            doc.font('Helvetica').fontSize(6).fillColor('black');
            fieldRows.forEach(([, value], i) => {
                doc.text(value, x + padd + valXOff, y + headerH + i * lineH, {
                    width: colW - valXOff - padd * 2,
                });
            });
        }
        doc.font('Helvetica').fontSize(6).fillColor('gray')
            .text(`Imprimé le ${new Date().toLocaleString('fr-FR')}`, 15, doc.page.height - 20, { align: 'right' });
        doc.end();
        return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(buffers))));
    }
    async generateBloqueAlertPdf(alertId, branchId, report) {
        const branch = await this.branchRepository.findOne({
            where: { id: branchId },
            relations: ['company'],
        });
        const company = branch?.company?.id
            ? await this.companyRepository.findOne({ where: { id: branch.company.id } })
            : null;
        const doc = new pdfkit_1.default({ margin: 30, size: 'A4' });
        const buffers = [];
        doc.on('data', (b) => buffers.push(b));
        const pageWidth = doc.page.width - 60;
        let y = 30;
        if (company?.logo) {
            const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
            try {
                if (fs.existsSync(logoPath))
                    doc.image(logoPath, 30, y, { width: 60 });
            }
            catch { }
        }
        doc.font('Helvetica-Bold').fontSize(16).fillColor('#135188')
            .text('Rapport d\'Alerte Blocage', 30, y + 10, { align: 'center', width: pageWidth });
        y += 30;
        doc.font('Helvetica').fontSize(9).fillColor('black');
        doc.text(`Agence: ${branch?.name ?? '-'}`, 30, y);
        y += 12;
        doc.text(`Date: ${new Date().toLocaleString('fr-FR')}`, 30, y);
        y += 20;
        const colX = [30, 300];
        const colW = [260, 200];
        const headers = ['Étape bloquée', 'Nombre de réparations'];
        const rowH = 16;
        doc.rect(30, y, pageWidth, rowH).fill('#135188');
        doc.font('Helvetica-Bold').fontSize(8).fillColor('white');
        headers.forEach((h, i) => doc.text(h, colX[i] + 4, y + 4, { width: colW[i] - 8 }));
        y += rowH;
        doc.font('Helvetica').fontSize(8).fillColor('black');
        report.forEach((item, i) => {
            const bgColor = i % 2 === 0 ? '#F5F5F5' : 'white';
            doc.rect(30, y, pageWidth, rowH).fill(bgColor);
            doc.fillColor('black');
            doc.text(item.step, colX[0] + 4, y + 4, { width: colW[0] - 8 });
            doc.text(String(item.count), colX[1] + 4, y + 4, { width: colW[1] - 8 });
            y += rowH;
        });
        y += 10;
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#135188')
            .text(`Total: ${report.length} étape(s) bloquée(s) (> 50 réparations)`, 30, y);
        doc.font('Helvetica').fontSize(7).fillColor('gray')
            .text(`Généré le ${new Date().toLocaleString('fr-FR')}`, 30, doc.page.height - 20, { align: 'right' });
        doc.end();
        return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(buffers))));
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(1, (0, typeorm_1.InjectRepository)(legislation_entity_1.Legislation)),
    __param(2, (0, typeorm_1.InjectRepository)(repair_entity_1.Repair)),
    __param(3, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PdfService);
//# sourceMappingURL=pdf.service.js.map