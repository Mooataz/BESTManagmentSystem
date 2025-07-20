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
exports.HistoryStockPartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const history_stock_part_entity_1 = require("./entities/history-stock-part.entity");
const user_entity_1 = require("../users/entities/user.entity");
const tracability_entity_1 = require("../tracability/entities/tracability.entity");
const stock_part_entity_1 = require("../stock-parts/entities/stock-part.entity");
let HistoryStockPartService = class HistoryStockPartService {
    historyStockPartRepositry;
    userRepositry;
    tracabilityRepositry;
    stockPartRepositry;
    constructor(historyStockPartRepositry, userRepositry, tracabilityRepositry, stockPartRepositry) {
        this.historyStockPartRepositry = historyStockPartRepositry;
        this.userRepositry = userRepositry;
        this.tracabilityRepositry = tracabilityRepositry;
        this.stockPartRepositry = stockPartRepositry;
    }
    async create(data) {
        const stockPart = await this.stockPartRepositry.findOne({ where: { id: data.stockPart } });
        if (!stockPart)
            throw new common_1.NotFoundException('stockPart not found');
        const user = await this.userRepositry.findOne({ where: { id: data.user?.id } });
        if (!user)
            throw new common_1.NotFoundException('user not found');
        const createHistoryStockPartDto = {
            step: data.step,
            date: data.date,
            stockPart: data.stockPart
        };
        const newCreate = this.historyStockPartRepositry.create(createHistoryStockPartDto);
        const saveHist = await this.historyStockPartRepositry.save(newCreate);
        const tracData = {
            user: user,
            stockPart: saveHist
        };
        const newTrac = await this.tracabilityRepositry.create(tracData);
        await this.tracabilityRepositry.save(newTrac);
        return saveHist;
    }
    async findAll() {
        const allfind = await this.historyStockPartRepositry.find();
        if (!allfind || allfind.length === 0) {
            throw new common_1.NotFoundException("There is no data available");
        }
        return allfind;
    }
    async findOne(id) {
        const Onefind = await this.historyStockPartRepositry.findOne({ where: { id } });
        if (!Onefind) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return Onefind;
    }
    async update(id, updateHistoryStockPartDto) {
        await this.historyStockPartRepositry.update(id, updateHistoryStockPartDto);
        const updatedata = await this.historyStockPartRepositry.findOne({ where: { id } });
        if (!updatedata) {
            throw new common_1.NotFoundException('data Not found for update = failed');
        }
        return updatedata;
    }
    async remove(id) {
        const deletedata = await this.historyStockPartRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('data Not found for delete = failed');
        }
        await this.historyStockPartRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
    async findByStockPartId(stockPartId) {
        return this.historyStockPartRepositry
            .createQueryBuilder('historyStockPart')
            .leftJoinAndSelect('historyStockPart.stockPart', 'stockPart')
            .where('stockPart.id = :stockPartId', { stockPartId })
            .getMany();
    }
};
exports.HistoryStockPartService = HistoryStockPartService;
exports.HistoryStockPartService = HistoryStockPartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(history_stock_part_entity_1.HistoryStockPart)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(tracability_entity_1.Tracability)),
    __param(3, (0, typeorm_1.InjectRepository)(stock_part_entity_1.StockPart)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], HistoryStockPartService);
//# sourceMappingURL=history-stock-part.service.js.map