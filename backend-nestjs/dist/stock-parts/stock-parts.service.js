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
exports.StockPartsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const stock_part_entity_1 = require("./entities/stock-part.entity");
const typeorm_2 = require("typeorm");
const app_service_1 = require("../app.service");
const bin_entity_1 = require("../bin/entities/bin.entity");
const models_service_1 = require("../models/models.service");
const references_service_1 = require("../references/references.service");
const branch_entity_1 = require("../branches/entities/branch.entity");
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const company_entity_1 = require("../company/entities/company.entity");
const history_stock_part_entity_1 = require("../history-stock-part/entities/history-stock-part.entity");
const tracability_entity_1 = require("../tracability/entities/tracability.entity");
const pdf_service_1 = require("../pdf/pdf.service");
const Stock_Gateway_1 = require("./Stock.Gateway");
const user_entity_1 = require("../users/entities/user.entity");
let StockPartsService = class StockPartsService {
    stockPartRepositry;
    branchRepositry;
    binRepositry;
    companyRepositry;
    historyStockPartRepositry;
    tracabilityRepositry;
    UserRepositry;
    appService;
    modelService;
    referenceService;
    PDFService;
    StockGateway;
    LOCK_FILE = path.join(os.tmpdir(), 'stock-calculation.lock');
    isRunning = false;
    constructor(stockPartRepositry, branchRepositry, binRepositry, companyRepositry, historyStockPartRepositry, tracabilityRepositry, UserRepositry, appService, modelService, referenceService, PDFService, StockGateway) {
        this.stockPartRepositry = stockPartRepositry;
        this.branchRepositry = branchRepositry;
        this.binRepositry = binRepositry;
        this.companyRepositry = companyRepositry;
        this.historyStockPartRepositry = historyStockPartRepositry;
        this.tracabilityRepositry = tracabilityRepositry;
        this.UserRepositry = UserRepositry;
        this.appService = appService;
        this.modelService = modelService;
        this.referenceService = referenceService;
        this.PDFService = PDFService;
        this.StockGateway = StockGateway;
    }
    async create(createStockPartDto, userId) {
        if (createStockPartDto.serialNumber) {
            createStockPartDto.serialNumber = this.appService.cleanSpaces(createStockPartDto.serialNumber);
        }
        const { userId: _uid, bin: binId, reference: refId, ...rest } = createStockPartDto;
        const newCreate = this.stockPartRepositry.create({
            ...rest,
            bin: binId ? { id: binId } : undefined,
            reference: refId ? { id: refId } : undefined,
        });
        const saveStockPart = await this.stockPartRepositry.save(newCreate);
        const history = this.historyStockPartRepositry.create({
            date: new Date(),
            step: 'Création',
            stockPart: { id: saveStockPart.id },
        });
        const savedHistory = await this.historyStockPartRepositry.save(history);
        const tracability = this.tracabilityRepositry.create({
            historyStockPart: { id: savedHistory.id },
            user: { id: userId },
        });
        await this.tracabilityRepositry.save(tracability);
        return saveStockPart;
    }
    async findAll() {
        return this.stockPartRepositry.find({
            relations: [
                'bin',
                'reference', 'reference.model', 'reference.model.brand', 'reference.allpart',
                'historyStockPart', 'historyStockPart.tracability', 'historyStockPart.tracability.user'
            ]
        });
    }
    async findOne(id) {
        const findOne = await this.stockPartRepositry.findOne({
            where: { id },
            relations: [
                'bin',
                'reference', 'reference.model', 'reference.model.brand', 'reference.allpart',
                'historyStockPart', 'historyStockPart.tracability', 'historyStockPart.tracability.user'
            ]
        });
        if (!findOne) {
            throw new common_1.NotFoundException('No data available');
        }
        return findOne;
    }
    async update(id, updateStockPartDto) {
        const { bin: binId, reference: refId, ...rest } = updateStockPartDto;
        const updateData = { ...rest };
        if (binId)
            updateData.bin = { id: Number(binId) };
        if (refId)
            updateData.reference = { id: Number(refId) };
        await this.stockPartRepositry.update(id, updateData);
        const updated = await this.stockPartRepositry.findOne({ where: { id } });
        if (!updated) {
            throw new common_1.NotFoundException('data not found to update');
        }
        return updated;
    }
    async remove(id) {
        const deletedata = await this.stockPartRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('data not found for delete');
        }
        await this.stockPartRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
    async filterByReferenceAndBin(referencesIds, binId) {
        return this.stockPartRepositry
            .createQueryBuilder('stockPart')
            .leftJoinAndSelect('stockPart.reference', 'reference')
            .leftJoinAndSelect('stockPart.bin', 'bin')
            .where('bin.id = :binId', { binId })
            .andWhere('reference.id IN (:...referencesIds)', { referencesIds })
            .getMany();
    }
    async findByBranchId(branchId) {
        return this.stockPartRepositry
            .createQueryBuilder('stockPart')
            .leftJoinAndSelect('stockPart.bin', 'bin')
            .leftJoinAndSelect('bin.branch', 'branch')
            .leftJoinAndSelect('stockPart.reference', 'reference')
            .leftJoinAndSelect('reference.model', 'model')
            .leftJoinAndSelect('model.brand', 'brand')
            .leftJoinAndSelect('reference.allpart', 'allpart')
            .leftJoinAndSelect('stockPart.historyStockPart', 'historyStockPart')
            .leftJoinAndSelect('historyStockPart.tracability', 'tracability')
            .leftJoinAndSelect('tracability.user', 'user')
            .where('branch.id = :branchId', { branchId })
            .orderBy('stockPart.id', 'DESC')
            .getMany();
    }
    async findByBinType(type, branchId) {
        return this.stockPartRepositry
            .createQueryBuilder('StockPart')
            .leftJoinAndSelect('StockPart.bin', 'bin')
            .leftJoinAndSelect('bin.branch', 'branch')
            .leftJoinAndSelect('StockPart.reference', 'reference')
            .leftJoinAndSelect('reference.allpart', 'allpart')
            .leftJoinAndSelect('reference.model', 'model')
            .where('bin.type = :type', { type })
            .andWhere('branch.id = :branchId', { branchId })
            .getMany();
    }
    async findGoodReference(references, branchId) {
        const refIds = references.map(ref => ref.id);
        const goodPart = await this.stockPartRepositry
            .createQueryBuilder('stockPart')
            .leftJoinAndSelect('stockPart.reference', 'ref')
            .leftJoinAndSelect('stockPart.bin', 'bin')
            .leftJoinAndSelect('bin.branch', 'branch')
            .where('bin.type = :type', { type: 'Good' })
            .andWhere('branch.id = :branchId', { branchId })
            .andWhere('ref.id IN (:...refIds)', { refIds })
            .getMany();
        return goodPart;
    }
    async AddHistoryStockPart(id, userId, step) {
        const history = this.historyStockPartRepositry.create({
            date: new Date(),
            step: step,
            stockPart: { id: id },
        });
        const savedHistory = await this.historyStockPartRepositry.save(history);
        const tracability = this.tracabilityRepositry.create({
            historyStockPart: { id: savedHistory.id },
            user: { id: userId },
        });
        await this.tracabilityRepositry.save(tracability);
        return id;
    }
    async findMultipleByIds(ids) {
        return this.stockPartRepositry.find({
            where: { id: (0, typeorm_2.In)(ids) },
            relations: [
                'bin', 'bin.branch',
                'reference', 'reference.model', 'reference.model.brand',
                'reference.model.typeModel', 'reference.allpart',
            ],
        });
    }
    async findAppareilComplet(modelId, branchId) {
        return this.stockPartRepositry
            .createQueryBuilder('stockPart')
            .leftJoinAndSelect('stockPart.bin', 'bin')
            .leftJoinAndSelect('bin.branch', 'branch')
            .leftJoinAndSelect('stockPart.reference', 'reference')
            .leftJoinAndSelect('reference.allpart', 'allpart')
            .leftJoinAndSelect('reference.model', 'model')
            .leftJoinAndSelect('stockPart.historyStockPart', 'historyStockPart')
            .leftJoinAndSelect('historyStockPart.tracability', 'tracability')
            .leftJoinAndSelect('tracability.user', 'user')
            .where('model.id = :modelId', { modelId })
            .andWhere('branch.id = :branchId', { branchId })
            .andWhere('LOWER(allpart.description) LIKE :desc', { desc: '%complet%' })
            .getMany();
    }
    async dismantle(id, binId, userId) {
        await this.stockPartRepositry.update(id, { bin: { id: binId } });
        await this.AddHistoryStockPart(id, userId, 'Démantèlement');
        return this.findOne(id);
    }
    async createDismantledPart(dto, userId, originalStockPartId) {
        const { userId: _uid, bin: binId, reference: refId, serialNumber, ...rest } = dto;
        if (!serialNumber) {
            throw new common_1.NotFoundException('Numéro de série obligatoire');
        }
        const finalSerial = this.appService.cleanSpaces(serialNumber);
        const newCreate = this.stockPartRepositry.create({
            ...rest,
            serialNumber: finalSerial,
            bin: binId ? { id: binId } : undefined,
            reference: refId ? { id: refId } : undefined,
        });
        const saved = await this.stockPartRepositry.save(newCreate);
        await this.AddHistoryStockPart(saved.id, userId, `Démantèlement(${originalStockPartId})`);
        return this.findOne(saved.id);
    }
};
exports.StockPartsService = StockPartsService;
exports.StockPartsService = StockPartsService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.DEFAULT }),
    __param(0, (0, typeorm_1.InjectRepository)(stock_part_entity_1.StockPart)),
    __param(1, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(2, (0, typeorm_1.InjectRepository)(bin_entity_1.Bin)),
    __param(3, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(4, (0, typeorm_1.InjectRepository)(history_stock_part_entity_1.HistoryStockPart)),
    __param(5, (0, typeorm_1.InjectRepository)(tracability_entity_1.Tracability)),
    __param(6, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        app_service_1.AppService,
        models_service_1.ModelsService,
        references_service_1.ReferencesService,
        pdf_service_1.PdfService,
        Stock_Gateway_1.StockGateway])
], StockPartsService);
//# sourceMappingURL=stock-parts.service.js.map