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
exports.TracabilityService = void 0;
const common_1 = require("@nestjs/common");
const tracability_entity_1 = require("./entities/tracability.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const history_repair_entity_1 = require("../history-repair/entities/history-repair.entity");
const history_stock_part_entity_1 = require("../history-stock-part/entities/history-stock-part.entity");
const user_entity_1 = require("../users/entities/user.entity");
let TracabilityService = class TracabilityService {
    tracabilityRepositry;
    historyRepairRepositry;
    historyStockPartRepositry;
    userRepositry;
    constructor(tracabilityRepositry, historyRepairRepositry, historyStockPartRepositry, userRepositry) {
        this.tracabilityRepositry = tracabilityRepositry;
        this.historyRepairRepositry = historyRepairRepositry;
        this.historyStockPartRepositry = historyStockPartRepositry;
        this.userRepositry = userRepositry;
    }
    async create(createTracabilityDto) {
        const user = await this.userRepositry.findOne({ where: { id: createTracabilityDto.user } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        let historyRepair = undefined;
        if (createTracabilityDto.historyRepair) {
            const historyRepair = await this.historyRepairRepositry.findOne({ where: { id: createTracabilityDto.historyRepair } });
            if (!historyRepair)
                throw new common_1.NotFoundException('HistoryRepair not found');
        }
        let historyStockPart = undefined;
        if (createTracabilityDto.historyStockPart) {
            const historyStockPart = await this.historyStockPartRepositry.findOne({ where: { id: createTracabilityDto.historyStockPart } });
            if (!historyStockPart)
                throw new common_1.NotFoundException('HistoryStockPart not found');
        }
        const tracabilityData = {
            user,
            historyRepair,
            historyStockPart,
        };
        const newCreate = this.tracabilityRepositry.create(tracabilityData);
        return await this.tracabilityRepositry.save(newCreate);
    }
    async findAll() {
        const findAll = await this.tracabilityRepositry.find();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findOne(id) {
        const findOne = await this.tracabilityRepositry.findOne({ where: { id },
            relations: ['user', 'historyRepair'] });
        if (!findOne) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findOne;
    }
    async update(id, updateTracabilityDto) {
        const tracability = await this.tracabilityRepositry.findOne({ where: { id } });
        if (!tracability) {
            throw new common_1.NotFoundException('Tracability record not found');
        }
        const historyRepair = updateTracabilityDto.historyRepair
            ? await this.historyRepairRepositry.findOne({ where: { id: updateTracabilityDto.historyRepair } })
            : tracability.historyRepair;
        const historyStockPart = updateTracabilityDto.historyStockPart
            ? await this.historyStockPartRepositry.findOne({ where: { id: updateTracabilityDto.historyStockPart } })
            : tracability.historyStockPart;
        const user = updateTracabilityDto.user
            ? await this.userRepositry.findOne({ where: { id: updateTracabilityDto.user } })
            : tracability.user;
        if (updateTracabilityDto.historyRepair && !historyRepair) {
            throw new common_1.NotFoundException('HistoryRepair not found');
        }
        if (updateTracabilityDto.historyStockPart && !historyStockPart) {
            throw new common_1.NotFoundException('HistoryStockPart not found');
        }
        if (updateTracabilityDto.user && !user) {
            throw new common_1.NotFoundException('User not found');
        }
        const updateData = {
            historyRepair: historyRepair || undefined,
            historyStockPart: historyStockPart || undefined,
            user: user || undefined,
        };
        await this.tracabilityRepositry.update(id, updateData);
        const updatedData = await this.tracabilityRepositry.findOne({ where: { id } });
        if (!updatedData) {
            throw new common_1.NotFoundException('Data not found after update');
        }
        return updatedData;
    }
    async remove(id) {
        const deletedata = await this.tracabilityRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('data Not found for delete = failed');
        }
        await this.tracabilityRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
    async findByHistoryRepairId(historyRepairId) {
        if (isNaN(historyRepairId)) {
            throw new common_1.BadRequestException('Invalid historyRepair ID - must be a number');
        }
        const tracability = await this.tracabilityRepositry
            .createQueryBuilder('tracability')
            .leftJoinAndSelect('tracability.historyRepair', 'historyRepair')
            .where('historyRepair.id = :historyRepairId', { historyRepairId })
            .getOne();
        if (!tracability) {
            throw new common_1.NotFoundException(`Tracability with historyRepair ID ${historyRepairId} not found`);
        }
        return tracability;
    }
    async findByHistoryStockPartId(historyStockPartId) {
        if (isNaN(historyStockPartId)) {
            throw new common_1.BadRequestException('Invalid historyRepair ID - must be a number');
        }
        const tracability = await this.tracabilityRepositry
            .createQueryBuilder('tracability')
            .leftJoinAndSelect('tracability.historyStockPartId', 'historyStockPartId')
            .where('historyStockPartId.id = :historyStockPartId', { historyStockPartId })
            .getOne();
        if (!tracability) {
            throw new common_1.NotFoundException(`Tracability with historyRepair ID ${historyStockPartId} not found`);
        }
        return tracability;
    }
};
exports.TracabilityService = TracabilityService;
exports.TracabilityService = TracabilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tracability_entity_1.Tracability)),
    __param(1, (0, typeorm_1.InjectRepository)(history_repair_entity_1.HistoryRepair)),
    __param(2, (0, typeorm_1.InjectRepository)(history_stock_part_entity_1.HistoryStockPart)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TracabilityService);
//# sourceMappingURL=tracability.service.js.map