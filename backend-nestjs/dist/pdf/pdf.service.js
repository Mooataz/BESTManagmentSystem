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
const fs = require("fs");
const common_1 = require("@nestjs/common");
const PDFDocument = require("pdfkit");
const path = require("path");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const company_entity_1 = require("../company/entities/company.entity");
const legislation_entity_1 = require("../legislation/entities/legislation.entity");
const branch_entity_1 = require("../branches/entities/branch.entity");
let PdfService = class PdfService {
    companyRepository;
    legislationRepository;
    branchRepository;
    constructor(companyRepository, legislationRepository, branchRepository) {
        this.companyRepository = companyRepository;
        this.legislationRepository = legislationRepository;
        this.branchRepository = branchRepository;
    }
    async generatRepairPdf(repair) {
        return new Promise(async (resolve, reject) => {
            const doc = new PDFDocument({ margin: 20 });
            const buffers = [];
            doc.on('data', (chunk) => buffers.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', reject);
            try {
                const firstHistory = repair.historyRepair?.[0] || {};
                const firstTracability = firstHistory.tracability?.[0] || {};
                const userBranch = firstTracability.user?.branch || {};
                const branchs = await this.branchRepository.find();
                const company = await this.companyRepository.findOne({
                    where: { id: userBranch.company?.id }
                });
                const allLaw = await this.legislationRepository.find();
                const startX = 50;
                const startY = 20;
                const logoWidth = 80;
                const logoHeight = 40;
                if (company?.logo) {
                    const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
                    if (fs.existsSync(logoPath)) {
                        doc.image(logoPath, startX, startY, { width: logoWidth });
                        const textY = startY + (logoHeight / 2) - (doc.currentLineHeight() / 2);
                        doc.fontSize(10)
                            .text(company.name, startX + logoWidth + 10, textY, { color: '"#135188' });
                    }
                }
                const contentStartY = startY + logoHeight;
                doc.fontSize(10)
                    .text(`Fiche de Réparation N°: ${repair.id}`, 50, contentStartY, {
                    align: 'center',
                });
                const boxWidth = doc.page.width / 3 - 40;
                const boxSpacing = 0;
                const lineHeight = 15;
                const padding = 6;
                const firstBoxY = contentStartY + 40;
                const calculateMaxHeight = (boxesItems) => {
                    return Math.max(...boxesItems.map(items => {
                        let totalLines = 0;
                        items.forEach(item => {
                            totalLines += 1;
                            if (Array.isArray(item.value)) {
                                totalLines += item.value.length;
                            }
                            else {
                                const text = String(item.value);
                                const approxLines = Math.ceil(doc.widthOfString(text) / 100);
                                totalLines += Math.max(1, approxLines);
                            }
                        });
                        return (totalLines * lineHeight) + (padding * 2);
                    }));
                };
                const safeDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('fr-FR') : 'N/A';
                const box1Items = [
                    { label: 'Client', value: repair.customer?.name || 'N/A' },
                    { label: 'Téléphone', value: repair.customer?.phone || 'N/A' },
                    { label: 'Distributeur', value: repair.customer?.distributer?.name || '-' },
                    { label: 'Reçue le', value: safeDate(firstHistory.date) },
                    { label: 'Employée', value: firstTracability.user?.name || '-' },
                    { label: 'Agence', value: userBranch.name || '-' }
                ];
                const box2Items = [
                    { label: 'Code Appareil', value: repair.device?.id || 'N/A' },
                    { label: 'Marque', value: repair.device?.model?.brand?.name || 'N/A' },
                    { label: 'Modèle', value: repair.device?.model?.name || 'N/A' },
                    { label: 'Imei', value: repair.device?.serialenumber || 'N/A' },
                    { label: 'Date achat', value: safeDate(repair.device?.purchaseDate) }
                ];
                const box3Items = [
                    { label: 'État appareil', value: repair.deviceStateReceive || '-' },
                    {
                        label: 'Accessoires',
                        value: repair.accessory?.length
                            ? repair.accessory.map(a => a.name)
                            : ['Aucun accessoire']
                    }
                ];
                const createBrandBox = (x, y, width, height) => {
                    if (repair.device?.model?.brand?.logo) {
                        const logoPath = path.join(__dirname, '..', '..', 'upload', 'brands', repair.device.model.brand.logo);
                        if (fs.existsSync(logoPath)) {
                            const logoWidth = 50;
                            const logoHeight = 40;
                            const logoX = x + (width - logoWidth) / 2;
                            const logoY = y + 5;
                            doc.image(logoPath, logoX, logoY, {
                                width: logoWidth,
                                height: logoHeight,
                            });
                            doc.restore();
                        }
                    }
                };
                const heights = [
                    box1Items.length * lineHeight + padding * 2,
                    box2Items.length * lineHeight + padding * 2,
                    box3Items.length * lineHeight + padding * 2
                ];
                const uniformHeight = Math.max(...heights);
                const boxSize = 50;
                const boxX = 500;
                const boxY = 20;
                createBrandBox(boxX, boxY, boxSize, boxSize);
                const drawUniformBox = (x, y, width, items, boxHeight) => {
                    doc.lineWidth(0.5)
                        .rect(x, y, width, boxHeight)
                        .stroke();
                    let currentY = y + padding;
                    const labelWidth = 60;
                    items.forEach(item => {
                        doc.font('Helvetica-Bold')
                            .fontSize(8)
                            .text(`${item.label}:`, x + 5, currentY, {
                            width: labelWidth,
                            align: 'left'
                        });
                        doc.font('Helvetica')
                            .fontSize(8)
                            .text(Array.isArray(item.value)
                            ? item.value.map((v, i) => i === 0 ? v : `• ${v}`).join('\n')
                            : String(item.value), x + labelWidth + 10, currentY, {
                            width: width - labelWidth - 15,
                            align: 'left'
                        });
                        currentY += lineHeight * (Array.isArray(item.value) ? item.value.length : 1);
                    });
                };
                drawUniformBox(50, firstBoxY, boxWidth, box1Items, uniformHeight);
                drawUniformBox(50 + boxWidth + boxSpacing, firstBoxY, boxWidth, box2Items, uniformHeight);
                drawUniformBox(50 + (boxWidth + boxSpacing) * 2, firstBoxY, boxWidth, box3Items, uniformHeight);
                const secondBoxY = firstBoxY + uniformHeight + 20;
                const box4Items = [{
                        label: 'Problèmes',
                        value: repair.listFault?.length
                            ? repair.listFault.map(f => f.name)
                            : ['Aucun problème']
                    }];
                const box5Items = [{
                        label: 'Remarque',
                        value: repair.remark || 'Aucune remarque'
                    }];
                const box6Items = [{
                        label: 'Demande client',
                        value: repair.customerRequest?.length
                            ? repair.customerRequest.map(r => r.name)
                            : ['Aucune demande']
                    }];
                const uniformHeight2 = calculateMaxHeight([box4Items, box5Items, box6Items]);
                drawUniformBox(50, secondBoxY - 20, boxWidth, box4Items, uniformHeight2);
                drawUniformBox(50 + boxWidth + boxSpacing, secondBoxY - 20, boxWidth, box5Items, uniformHeight2);
                drawUniformBox(50 + (boxWidth + boxSpacing) * 2, secondBoxY - 20, boxWidth, box6Items, uniformHeight2);
                const lawItems = allLaw.map(law => law.name);
                const lawBoxY = secondBoxY + uniformHeight2;
                const lawBoxWidth = doc.page.width - 40;
                this.drawTwoColumnBox(doc, 20, lawBoxY - 20, lawBoxWidth, 'Législations Applicables', lawItems);
                const stY = 400;
                doc.moveTo(20, stY)
                    .lineTo(600, stY)
                    .lineWidth(0, 5)
                    .stroke();
                const textY = 550 + (logoHeight / 2) - (doc.currentLineHeight() / 2);
                doc.fontSize(8)
                    .text('BEST', startX, stY + 10, { color: '"#135188' });
                doc.fontSize(6)
                    .text('Adresse :' + company?.headquarterslocation, startX, stY + 20, { color: '"#135188' });
                doc.fontSize(6)
                    .text('Banque: ' + company?.bank, startX, stY + 30, { color: '"#135188' });
                doc.fontSize(6)
                    .text('RIB: ' + company?.rib, startX, stY + 40, { color: '"#135188' });
                doc.fontSize(6)
                    .text('MF: ' + company?.taxRegisterNumber, startX, stY + 50, { color: '"#135188' });
                const branch = repair.historyRepair[0].tracability[0].user.branch;
                doc.fontSize(8)
                    .text('Agence: ' + branch.name, startX + 200, stY + 10, { color: '"#135188' });
                doc.fontSize(6)
                    .text('Téléphone: ' + branch.phone, startX + 200, stY + 20, { color: '"#135188' });
                doc.fontSize(6)
                    .text('E-mail: ' + branch.email, startX + 200, stY + 30, { color: '"#135188' });
                doc.fontSize(6)
                    .text('E-Adresse: ' + branch.location, startX + 200, stY + 40, { color: '"#135188' });
                doc.moveTo(20, stY + 60)
                    .lineTo(600, stY + 60)
                    .lineWidth(1)
                    .dash(5, { space: 3 })
                    .stroke();
                doc.undash();
                if (company?.logo) {
                    const logoPath = path.join(__dirname, '..', '..', 'upload', 'company', company.logo);
                    if (fs.existsSync(logoPath)) {
                        doc.image(logoPath, startX, stY + 70, { width: logoWidth });
                        const textY = stY + 70 + (logoHeight / 2) - (doc.currentLineHeight() / 2);
                        doc.fontSize(10)
                            .text(company.name, startX + logoWidth + 10, textY, { color: '"#135188' });
                    }
                }
                const StartY = stY + 70 + logoHeight + 10;
                doc.fontSize(10)
                    .text(`Fiche de Réparation N°: ${repair.id}`, 50, StartY, {
                    align: 'center',
                });
                createBrandBox(500, stY + 70, 50, 50);
                const Ystart = StartY + 10;
                drawUniformBox(50, Ystart, boxWidth, box1Items, uniformHeight);
                drawUniformBox(50 + boxWidth + boxSpacing, Ystart, boxWidth, box2Items, uniformHeight);
                drawUniformBox(50 + (boxWidth + boxSpacing) * 2, Ystart, boxWidth, box3Items, uniformHeight);
                const uniformHeight3 = calculateMaxHeight([box4Items, box5Items, box6Items]);
                drawUniformBox(50, Ystart + 110, boxWidth, box4Items, uniformHeight2);
                drawUniformBox(50 + boxWidth + boxSpacing, Ystart + 110, boxWidth, box5Items, uniformHeight2);
                drawUniformBox(50 + (boxWidth + boxSpacing) * 2, Ystart + 110, boxWidth, box6Items, uniformHeight2);
                doc.fontSize(6)
                    .text(`Document généré le ${new Date().toLocaleDateString('fr-FR')}`, 50, doc.page.height - 30, { align: 'right' });
                doc.end();
            }
            catch (error) {
                console.error('Erreur génération PDF:', error);
                reject(error);
            }
        });
    }
    drawTwoColumnBox(doc, x, y, width, title, items) {
        const padding = 5;
        const lineHeight = 5;
        const columnGap = 10;
        const columnWidth = (width - columnGap) / 2;
        const itemsPerColumn = Math.ceil(items.length / 2);
        const boxHeight = Math.max(itemsPerColumn * lineHeight + padding * 2, 40);
        doc.font('Helvetica-Bold').fontSize(7);
        doc.rect(x, y, width, boxHeight).stroke();
        doc.text(title, x + padding, y + padding, {
            width: width - padding * 2,
            align: 'center'
        });
        const column1Items = items.slice(0, Math.ceil(items.length / 2));
        const column2Items = items.slice(Math.ceil(items.length / 2));
        doc.font('Helvetica').fontSize(6);
        let currentY = y + padding + doc.currentLineHeight();
        column1Items.forEach(item => {
            doc.text(`• ${item}`, x + padding, currentY, {
                width: columnWidth,
                align: 'left'
            });
            currentY += lineHeight;
        });
        currentY = y + padding + doc.currentLineHeight();
        column2Items.forEach(item => {
            doc.text(`• ${item}`, x + columnWidth + columnGap, currentY, {
                width: columnWidth,
                align: 'left'
            });
            currentY += lineHeight;
        });
        return boxHeight;
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(1, (0, typeorm_1.InjectRepository)(legislation_entity_1.Legislation)),
    __param(2, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PdfService);
//# sourceMappingURL=pdf.service.js.map