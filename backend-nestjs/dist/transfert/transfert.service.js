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
exports.TransfertService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const transfert_entity_1 = require("./entities/transfert.entity");
const typeorm_2 = require("typeorm");
const stock_part_entity_1 = require("../stock-parts/entities/stock-part.entity");
const repair_entity_1 = require("../repair/entities/repair.entity");
let TransfertService = class TransfertService {
    transfertRepositry;
    stockPartRepositry;
    repairRepositry;
    constructor(transfertRepositry, stockPartRepositry, repairRepositry) {
        this.transfertRepositry = transfertRepositry;
        this.stockPartRepositry = stockPartRepositry;
        this.repairRepositry = repairRepositry;
    }
    async create(createTransfertDto) {
        const stockPart = await this.stockPartRepositry.find({ where: { id: (0, typeorm_2.In)(createTransfertDto.stockPartIds) }, });
        const repair = await this.repairRepositry.find({ where: { id: (0, typeorm_2.In)(createTransfertDto.repairIds) }, });
        if ((!stockPart.length) && (!repair.length)) {
            throw new common_1.NotFoundException('No data for transfert');
        }
        ;
        let newCreate;
        if (!stockPart.length) {
            newCreate = this.transfertRepositry.create({ ...createTransfertDto, repair });
        }
        else {
            newCreate = this.transfertRepositry.create({ ...createTransfertDto, stockPart });
        }
        return await this.transfertRepositry.save(newCreate);
    }
    async findAll() {
        const findAll = await this.transfertRepositry.find();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no Transfert available");
        }
        return findAll;
    }
    async findOne(id) {
        const findOne = await this.transfertRepositry.findOne({ where: { id } });
        if (!findOne) {
            throw new common_1.NotFoundException("There is no Transfert available");
        }
        return findOne;
    }
    async update(id, updateTransfertDto) {
        await this.transfertRepositry.update(id, updateTransfertDto);
        const updatedata = await this.transfertRepositry.findOne({ where: { id } });
        if (!updatedata) {
            throw new common_1.NotFoundException('Transfert Not found for update = failed');
        }
        return updatedata;
    }
    async remove(id) {
        const deletedata = await this.transfertRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('Transfert Not found for delete = failed');
        }
        await this.transfertRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
    async findByState(state) {
        const findAll = await this.transfertRepositry
            .createQueryBuilder('transfert')
            .where('state = :state', { state })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findByBranchId(branchId) {
        const findAll = await this.transfertRepositry
            .createQueryBuilder('transfert')
            .where('fromBranch = :branchId', { branchId })
            .orWhere('toBranch = :branchId', { branchId })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
};
exports.TransfertService = TransfertService;
exports.TransfertService = TransfertService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transfert_entity_1.Transfert)),
    __param(1, (0, typeorm_1.InjectRepository)(stock_part_entity_1.StockPart)),
    __param(2, (0, typeorm_1.InjectRepository)(repair_entity_1.Repair)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TransfertService);
//# sourceMappingURL=transfert.service.js.map