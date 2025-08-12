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
const fs = require("fs/promises");
const path = require("path");
const os = require("os");
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
        createStockPartDto.serialNumber = this.appService.cleanSpaces(createStockPartDto.serialNumber);
        const newCreate = this.stockPartRepositry.create(createStockPartDto);
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
        const findAll = await this.stockPartRepositry.find({ relations: [
                'bin',
                'reference', 'reference.model', 'reference.model.brand', 'reference.allpart',
                'historyStockPart', 'historyStockPart.tracability', 'historyStockPart.tracability.user'
            ] });
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException('No data found');
        }
        return findAll;
    }
    async findOne(id) {
        const findOne = await this.stockPartRepositry.findOne({ where: { id } });
        if (!findOne) {
            throw new common_1.NotFoundException('No data available');
        }
        return findOne;
    }
    async update(id, updateStockPartDto) {
        await this.stockPartRepositry.update(id, updateStockPartDto);
        const updateData = await this.stockPartRepositry.findOne({ where: { id } });
        if (!updateData) {
            throw new common_1.NotFoundException('data not found to update');
        }
        return updateData;
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
        const findAll = await this.stockPartRepositry
            .createQueryBuilder('stockPart')
            .leftJoinAndSelect('stockPart.reference', 'reference')
            .leftJoinAndSelect('stockPart.bin', 'bin')
            .where('bin.id = :binId', { binId })
            .andWhere('reference.id IN (:...referencesIds)', { referencesIds })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
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
    async stateStock() {
        if (this.isRunning) {
            console.log('Calcul déjà en cours (verrou mémoire)');
            return;
        }
        try {
            const fd = await fs.open(this.LOCK_FILE, 'wx');
            await fd.close();
        }
        catch (error) {
            if (error.code === 'EEXIST') {
                console.log('Calcul déjà en cours (verrou fichier)');
                return;
            }
            throw error;
        }
        this.isRunning = true;
        const executionId = Date.now();
        try {
            console.log(`[${executionId}] Début du calcul du stock`);
            console.log('debut:');
            const allBranch = await this.branchRepositry.find();
            const models = await this.modelService.findAll();
            var stockByReference = [];
            for (const branch of allBranch) {
                const branchCriticalParts = [];
                for (const model of models) {
                    for (const part of model.allpart) {
                        const counter = await this.findGoodReference(await this.referenceService.findCompatibleReferences(model.id, part.id), branch.id);
                        const count = Number(counter.length);
                        if (isNaN(count))
                            continue;
                        const quantityAlertStock = (await this.stockPartRepositry
                            .createQueryBuilder('stockPart')
                            .leftJoin('stockPart.bin', 'bin')
                            .leftJoin('bin.branch', 'branch')
                            .leftJoin('branch.company', 'company')
                            .where('stockPart.id = :stockPartId', { stockPartId: part.id })
                            .select(['company.quantityAlertStock'])
                            .getRawOne())?.company_quantityAlertStock;
                        if (count <= quantityAlertStock) {
                            branchCriticalParts.push({
                                modelId: model.id,
                                modelName: model.name,
                                partId: part.id,
                                partName: part.description,
                                count,
                            });
                        }
                    }
                }
                if (branchCriticalParts.length > 0) {
                    const pdfPath = await this.PDFService.generateStockReport(branch.id, branchCriticalParts);
                    const usersToNotify = await this.UserRepositry
                        .createQueryBuilder('user')
                        .innerJoin('user.branch', 'branch')
                        .where('branch.id = :branchId', { branchId: branch.id })
                        .andWhere('user.role IN (:...roles)', { roles: ['Admin', 'StockKeeper'] })
                        .getMany();
                    const userIds = usersToNotify.map((u) => u.id);
                    await this.StockGateway.sendStockAlertToUsers(userIds, {
                        branchId: branch.id,
                        reportUrl: `/uploads/stock-report-branch-${branch.id}.pdf`,
                        message: `:danger: Rapport de stock critique généré pour la branche ${branch.id}`,
                    });
                }
            }
            console.log(`[${executionId}] Résultat:`, stockByReference);
            return stockByReference;
        }
        catch (error) {
            console.error(`[${executionId}] Erreur lors du calcul:`, error);
            throw {
                message: 'Erreur lors du calcul du stock',
                status: 500,
                data: null
            };
        }
        finally {
            this.isRunning = false;
            try {
                await fs.unlink(this.LOCK_FILE);
            }
            catch (cleanupError) {
                if (cleanupError.code !== 'ENOENT') {
                    console.error('Erreur lors du nettoyage du verrou:', cleanupError);
                }
            }
        }
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