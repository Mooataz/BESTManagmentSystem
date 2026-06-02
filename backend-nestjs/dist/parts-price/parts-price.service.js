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
exports.PartsPriceService = void 0;
const common_1 = require("@nestjs/common");
const parts_price_entity_1 = require("./entities/parts-price.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const model_entity_1 = require("../models/entities/model.entity");
const all_part_entity_1 = require("../all-parts/entities/all-part.entity");
const level_repair_entity_1 = require("../level-repair/entities/level-repair.entity");
const ExcelJS = __importStar(require("exceljs"));
let PartsPriceService = class PartsPriceService {
    partsPriceRepositry;
    modelRepositry;
    allPartRepositry;
    levelRepairRepositry;
    constructor(partsPriceRepositry, modelRepositry, allPartRepositry, levelRepairRepositry) {
        this.partsPriceRepositry = partsPriceRepositry;
        this.modelRepositry = modelRepositry;
        this.allPartRepositry = allPartRepositry;
        this.levelRepairRepositry = levelRepairRepositry;
    }
    async getReferences() {
        const [brands, models, allParts, levelRepairs] = await Promise.all([
            this.partsPriceRepositry.manager.query('SELECT DISTINCT name FROM brand ORDER BY name ASC'),
            this.modelRepositry.find({ order: { name: 'ASC' } }),
            this.allPartRepositry.find({ order: { description: 'ASC' } }),
            this.levelRepairRepositry.find({ order: { name: 'ASC' } }),
        ]);
        return {
            brands: brands.map((b) => b.name),
            models: models.map((m) => m.name),
            allParts: allParts.map((a) => a.description),
            levelRepairs: levelRepairs.map((l) => l.name),
        };
    }
    async generateTemplate() {
        const refs = await this.getReferences();
        const workbook = new ExcelJS.Workbook();
        const sheet1 = workbook.addWorksheet('Modèle');
        sheet1.columns = [
            { header: 'Marque', key: 'brandName', width: 20 },
            { header: 'Modèle', key: 'modelName', width: 25 },
            { header: 'Pièce', key: 'allPartDescription', width: 30 },
            { header: 'Prix', key: 'price', width: 15 },
            { header: 'Niveau de réparation', key: 'levelRepairName', width: 20 },
        ];
        sheet1.addRow({ brandName: '', modelName: '', allPartDescription: '', price: '', levelRepairName: '' });
        sheet1.getRow(1).font = { bold: true };
        const sheet2 = workbook.addWorksheet('Références');
        let rowNum = 1;
        sheet2.getCell(rowNum, 1).value = 'Marques';
        sheet2.getCell(rowNum, 1).font = { bold: true };
        rowNum++;
        refs.brands.forEach((b, i) => { sheet2.getCell(rowNum + i, 1).value = b; });
        rowNum += refs.brands.length + 1;
        sheet2.getCell(rowNum, 1).value = 'Modèles';
        sheet2.getCell(rowNum, 1).font = { bold: true };
        rowNum++;
        refs.models.forEach((m, i) => { sheet2.getCell(rowNum + i, 1).value = m; });
        rowNum += refs.models.length + 1;
        sheet2.getCell(rowNum, 1).value = 'Pièces';
        sheet2.getCell(rowNum, 1).font = { bold: true };
        rowNum++;
        refs.allParts.forEach((p, i) => { sheet2.getCell(rowNum + i, 1).value = p; });
        rowNum += refs.allParts.length + 1;
        sheet2.getCell(rowNum, 1).value = 'Niveaux de réparation';
        sheet2.getCell(rowNum, 1).font = { bold: true };
        rowNum++;
        refs.levelRepairs.forEach((l, i) => { sheet2.getCell(rowNum + i, 1).value = l; });
        return await workbook.xlsx.writeBuffer();
    }
    async create(createPartsPriceDto) {
        const model = await this.modelRepositry.findOne({ where: { id: createPartsPriceDto.modelId }, });
        if (!model) {
            throw new common_1.NotFoundException(`Model with ID ${createPartsPriceDto.modelId} not found`);
        }
        const allPart = await this.allPartRepositry.findOne({ where: { id: createPartsPriceDto.allPartId }, });
        if (!allPart) {
            throw new common_1.NotFoundException(`AllPart with ID ${createPartsPriceDto.allPartId} not found`);
        }
        const levelRepair = await this.levelRepairRepositry.findOne({ where: { id: createPartsPriceDto.laborCharge } });
        if (!levelRepair) {
            throw new common_1.NotFoundException('Level repair not found');
        }
        ;
        const partsPrice = this.partsPriceRepositry.create({ ...createPartsPriceDto, model, allPart, levelRepair });
        return this.partsPriceRepositry.save(partsPrice);
    }
    async findAll() {
        const findAll = await this.partsPriceRepositry.find({ relations: ['model', 'model.brand', 'allPart', 'levelRepair'] });
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException('No data found');
        }
        return findAll;
    }
    async findOne(id) {
        const findOne = await this.partsPriceRepositry.findOne({ where: { id } });
        if (!findOne) {
            throw new common_1.NotFoundException('No data available');
        }
        return findOne;
    }
    async update(id, updatePartsPriceDto) {
        await this.partsPriceRepositry.update(id, updatePartsPriceDto);
        const updateData = await this.partsPriceRepositry.findOne({ where: { id } });
        if (!updateData) {
            throw new common_1.NotFoundException('Data not found to update');
        }
        return updateData;
    }
    async remove(id) {
        const deletedata = await this.partsPriceRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('Data not found for delete');
        }
        await this.partsPriceRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
    async importExcel(rows) {
        let imported = 0;
        const errors = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            try {
                if (!row.brandName || !row.modelName || !row.allPartDescription || row.price == null) {
                    errors.push(`Ligne ${i + 1}: Données incomplètes`);
                    continue;
                }
                const model = await this.modelRepositry.findOne({
                    where: { name: row.modelName, brand: { name: row.brandName } },
                    relations: ['brand'],
                });
                if (!model) {
                    errors.push(`Ligne ${i + 1}: Modèle "${row.modelName}" (${row.brandName}) introuvable`);
                    continue;
                }
                const allPart = await this.allPartRepositry.findOne({
                    where: { description: row.allPartDescription },
                });
                if (!allPart) {
                    errors.push(`Ligne ${i + 1}: Pièce "${row.allPartDescription}" introuvable`);
                    continue;
                }
                let levelRepair = null;
                if (row.levelRepairName) {
                    levelRepair = await this.levelRepairRepositry.findOne({
                        where: { name: row.levelRepairName },
                    });
                    if (!levelRepair) {
                        errors.push(`Ligne ${i + 1}: Niveau réparation "${row.levelRepairName}" introuvable`);
                        continue;
                    }
                }
                let partsPrice = await this.partsPriceRepositry.findOne({
                    where: { model: { id: model.id }, allPart: { id: allPart.id } },
                });
                if (partsPrice) {
                    partsPrice.price = row.price;
                    if (levelRepair)
                        partsPrice.levelRepair = levelRepair;
                    await this.partsPriceRepositry.save(partsPrice);
                }
                else {
                    partsPrice = this.partsPriceRepositry.create({
                        price: row.price,
                        model,
                        allPart,
                        levelRepair: levelRepair ?? undefined,
                    });
                    await this.partsPriceRepositry.save(partsPrice);
                }
                imported++;
            }
            catch (err) {
                errors.push(`Ligne ${i + 1}: ${err.message}`);
            }
        }
        return { imported, errors };
    }
    async findByModelallPArt(modelId, allPartId) {
        const find = await this.partsPriceRepositry.findOne({ where: { model: { id: modelId },
                allPart: { id: allPartId }, },
            relations: ['model', 'allPart'], });
        if (!find) {
            throw new common_1.NotFoundException('Data not founded by this Ids');
        }
        return find;
    }
};
exports.PartsPriceService = PartsPriceService;
exports.PartsPriceService = PartsPriceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(parts_price_entity_1.PartsPrice)),
    __param(1, (0, typeorm_1.InjectRepository)(model_entity_1.Model)),
    __param(2, (0, typeorm_1.InjectRepository)(all_part_entity_1.AllPart)),
    __param(3, (0, typeorm_1.InjectRepository)(level_repair_entity_1.LevelRepair)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PartsPriceService);
//# sourceMappingURL=parts-price.service.js.map