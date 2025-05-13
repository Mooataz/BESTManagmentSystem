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
let HistoryStockPartService = class HistoryStockPartService {
    historyStockPartRepositry;
    constructor(historyStockPartRepositry) {
        this.historyStockPartRepositry = historyStockPartRepositry;
    }
    async create(createHistoryStockPartDto) {
        return await this.historyStockPartRepositry.save(createHistoryStockPartDto);
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
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HistoryStockPartService);
//# sourceMappingURL=history-stock-part.service.js.map