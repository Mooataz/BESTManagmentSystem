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
exports.ApproveStockService = void 0;
const common_1 = require("@nestjs/common");
const approve_stock_entity_1 = require("./entities/approve-stock.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const stock_part_entity_1 = require("../stock-parts/entities/stock-part.entity");
const bin_entity_1 = require("../bin/entities/bin.entity");
const history_stock_part_entity_1 = require("../history-stock-part/entities/history-stock-part.entity");
const tracability_entity_1 = require("../tracability/entities/tracability.entity");
const reference_entity_1 = require("../references/entities/reference.entity");
const company_entity_1 = require("../company/entities/company.entity");
let ApproveStockService = class ApproveStockService {
    approveStockRepositry;
    stockPartRepositry;
    binRepositry;
    referenceRepositry;
    historyStockPartRepositry;
    tracabilityRepositry;
    companyRepositry;
    constructor(approveStockRepositry, stockPartRepositry, binRepositry, referenceRepositry, historyStockPartRepositry, tracabilityRepositry, companyRepositry) {
        this.approveStockRepositry = approveStockRepositry;
        this.stockPartRepositry = stockPartRepositry;
        this.binRepositry = binRepositry;
        this.referenceRepositry = referenceRepositry;
        this.historyStockPartRepositry = historyStockPartRepositry;
        this.tracabilityRepositry = tracabilityRepositry;
        this.companyRepositry = companyRepositry;
    }
    async create(createApproveStockDto) {
        return await this.approveStockRepositry.save(createApproveStockDto);
    }
    async findByRepairId(repairId) {
        const findAll = await this.approveStockRepositry
            .createQueryBuilder('approveStock')
            .leftJoinAndSelect('approveStock.repair', 'repair')
            .where('repair.id = :repairId', { repairId })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findBySaleId(saleId) {
        const findAll = await this.approveStockRepositry
            .createQueryBuilder('approveStock')
            .leftJoinAndSelect('approveStock.sale', 'sale')
            .where('sale.id = :saleId', { saleId })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findByBranchId(branchId) {
        const findAll = await this.approveStockRepositry
            .createQueryBuilder("approveStock")
            .leftJoinAndSelect("approveStock.repair", "repair")
            .leftJoinAndSelect("repair.user", "user")
            .leftJoinAndSelect("repair.device", "device")
            .leftJoinAndSelect("device.model", "model")
            .leftJoinAndSelect("model.brand", "brand")
            .leftJoinAndSelect("repair.historyRepair", "historyRepair")
            .where("repair.actuellyBranch = :branchId", { branchId })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findByType(types) {
        const findAll = await this.approveStockRepositry
            .createQueryBuilder("approveStock")
            .where("type = :types", { types })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findByState(state) {
        const findAll = await this.approveStockRepositry
            .createQueryBuilder("approveStock")
            .where("state = :state", { state })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findAll() {
        const findAll = await this.approveStockRepositry.find();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findOne(id) {
        const findOne = await this.approveStockRepositry.findOne({ where: { id } });
        if (!findOne) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findOne;
    }
    async update(id, updateApproveStockDto) {
        await this.approveStockRepositry.update(id, updateApproveStockDto);
        const updatedata = await this.approveStockRepositry.findOne({ where: { id } });
        if (!updatedata) {
            throw new common_1.NotFoundException('data Not found for update = failed');
        }
        return updatedata;
    }
    async remove(id) {
        const deletedata = await this.approveStockRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('data Not found for delete = failed');
        }
        await this.approveStockRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
    async findAvailableParts(approveStockId, branchId) {
        const approveStock = await this.approveStockRepositry.findOne({
            where: { id: approveStockId },
            relations: ['repair', 'repair.device', 'repair.device.model'],
        });
        if (!approveStock)
            throw new common_1.NotFoundException('ApproveStock not found');
        const allPartId = approveStock.idPartRepair;
        const modelId = approveStock.repair?.device?.model?.id;
        if (!allPartId)
            throw new common_1.BadRequestException('No part associated');
        if (!modelId)
            throw new common_1.BadRequestException('No model associated');
        const referenceIds = await this.referenceRepositry
            .createQueryBuilder('ref')
            .innerJoin('ref.allpart', 'ap')
            .innerJoin('ref.model', 'm')
            .where('ap.id = :allPartId', { allPartId })
            .andWhere('m.id = :modelId', { modelId })
            .select('ref.id')
            .getMany();
        const refIds = referenceIds.map(r => r.id);
        if (refIds.length === 0)
            return [];
        return this.stockPartRepositry
            .createQueryBuilder('stockPart')
            .leftJoinAndSelect('stockPart.reference', 'reference')
            .leftJoinAndSelect('stockPart.bin', 'bin')
            .leftJoinAndSelect('bin.branch', 'branch')
            .leftJoinAndSelect('reference.allpart', 'allpart')
            .where('reference.id IN (:...refIds)', { refIds })
            .andWhere('bin.type = :type', { type: 'Bon' })
            .andWhere('branch.id = :branchId', { branchId })
            .andWhere('stockPart.id NOT IN (SELECT COALESCE("as"."stockPartId", 0) FROM "approve_stock" "as" WHERE "as"."stockPartId" IS NOT NULL)')
            .getMany();
    }
    async confirmPart(approveStockId, stockPartId, binDefectId, userId) {
        const approveStock = await this.approveStockRepositry.findOne({
            where: { id: approveStockId },
            relations: ['stockPart'],
        });
        if (!approveStock)
            throw new common_1.NotFoundException('ApproveStock not found');
        const stockPart = await this.stockPartRepositry.findOne({
            where: { id: stockPartId },
            relations: ['bin', 'bin.branch'],
        });
        if (!stockPart)
            throw new common_1.NotFoundException('StockPart not found');
        if (stockPart.bin?.type !== 'Bon')
            throw new common_1.BadRequestException('Part is not available (not in Bon bin)');
        const defectBin = await this.binRepositry.findOne({ where: { id: binDefectId } });
        if (!defectBin)
            throw new common_1.NotFoundException('Defective bin not found');
        await this.stockPartRepositry.update(stockPartId, { bin: { id: defectBin.id } });
        const history = await this.historyStockPartRepositry.save(this.historyStockPartRepositry.create({
            date: new Date(),
            step: 'Réparation',
            stockPart: { id: stockPartId },
        }));
        await this.tracabilityRepositry.save(this.tracabilityRepositry.create({
            user: { id: userId },
            historyStockPart: { id: history.id },
        }));
        await this.approveStockRepositry.update(approveStockId, {
            stockPart: { id: stockPartId },
            state: 'Confirmer',
        });
        const updated = await this.approveStockRepositry.findOne({
            where: { id: approveStockId },
            relations: ['stockPart', 'stockPart.bin'],
        });
        if (!updated)
            throw new common_1.NotFoundException('ApproveStock not found after update');
        return updated;
    }
    async updateState(id, binDefectId, updateApproveStockDto) {
        const approveStock = await this.approveStockRepositry.findOne({
            where: { id },
            relations: ['stockPart'],
        });
        if (!approveStock) {
            throw new common_1.NotFoundException('ApproveStock not found');
        }
        await this.approveStockRepositry
            .createQueryBuilder()
            .update(approve_stock_entity_1.ApproveStock)
            .set(updateApproveStockDto)
            .where('id = :id', { id })
            .execute();
        if (updateApproveStockDto.state === 'Approved' && approveStock.stockPart?.id) {
            await this.stockPartRepositry
                .createQueryBuilder()
                .update(stock_part_entity_1.StockPart)
                .set({ bin: { id: binDefectId } })
                .where('id = :stockPartId', { stockPartId: approveStock.stockPart.id })
                .execute();
        }
        const updatedApproveStock = await this.approveStockRepositry.findOne({
            where: { id },
            relations: ['stockPart', 'stockPart.bin'],
        });
        if (!updatedApproveStock) {
            throw new common_1.NotFoundException('Pas Trouver la confirmation aprés modification');
        }
        return updatedApproveStock;
    }
};
exports.ApproveStockService = ApproveStockService;
exports.ApproveStockService = ApproveStockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(approve_stock_entity_1.ApproveStock)),
    __param(1, (0, typeorm_2.InjectRepository)(stock_part_entity_1.StockPart)),
    __param(2, (0, typeorm_2.InjectRepository)(bin_entity_1.Bin)),
    __param(3, (0, typeorm_2.InjectRepository)(reference_entity_1.Reference)),
    __param(4, (0, typeorm_2.InjectRepository)(history_stock_part_entity_1.HistoryStockPart)),
    __param(5, (0, typeorm_2.InjectRepository)(tracability_entity_1.Tracability)),
    __param(6, (0, typeorm_2.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], ApproveStockService);
//# sourceMappingURL=approve-stock.service.js.map