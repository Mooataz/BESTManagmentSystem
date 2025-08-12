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
const user_entity_1 = require("../users/entities/user.entity");
const branch_entity_1 = require("../branches/entities/branch.entity");
let TransfertService = class TransfertService {
    transfertRepositry;
    stockPartRepositry;
    repairRepositry;
    userRepositry;
    branchRepositry;
    constructor(transfertRepositry, stockPartRepositry, repairRepositry, userRepositry, branchRepositry) {
        this.transfertRepositry = transfertRepositry;
        this.stockPartRepositry = stockPartRepositry;
        this.repairRepositry = repairRepositry;
        this.userRepositry = userRepositry;
        this.branchRepositry = branchRepositry;
    }
    async create(createTransfertDto) {
        const stockPart = await this.stockPartRepositry.find({
            where: { id: (0, typeorm_2.In)(createTransfertDto.stockPartIds ?? []) },
        });
        const repair = await this.repairRepositry.find({
            where: { id: (0, typeorm_2.In)(createTransfertDto.repairIds ?? []) },
        });
        if ((!stockPart.length) && (!repair.length)) {
            throw new common_1.NotFoundException('No data for transfert');
        }
        ;
        let newCreate;
        if (!stockPart.length) {
            newCreate = this.transfertRepositry.create({ ...createTransfertDto, repair });
            await this.repairRepositry
                .createQueryBuilder()
                .update(repair_entity_1.Repair)
                .set({ actuellybranch: 0 })
                .where('id IN (:...ids)', { ids: repair.map(p => p.id) })
                .execute();
        }
        else {
            newCreate = this.transfertRepositry.create({ ...createTransfertDto, stockPart });
            await this.stockPartRepositry
                .createQueryBuilder()
                .update(stock_part_entity_1.StockPart)
                .set({ bin: () => 'NULL' })
                .where('id IN (:...ids)', { ids: stockPart.map(p => p.id) })
                .execute();
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
    async update(id, data) {
        const stockPart = await this.stockPartRepositry.find({
            where: { id: (0, typeorm_2.In)(data.stockPartIds ?? []) },
        });
        const repair = await this.repairRepositry.find({
            where: { id: (0, typeorm_2.In)(data.repairIds ?? []) },
        });
        if ((!stockPart.length) && (!repair.length)) {
            throw new common_1.NotFoundException('No data for transfert');
        }
        if (repair.length) {
            await this.repairRepositry
                .createQueryBuilder()
                .update(repair_entity_1.Repair)
                .set({ actuellybranch: data.actuellybranch })
                .where('id IN (:...ids)', { ids: repair.map(p => p.id) })
                .execute();
        }
        if (stockPart.length) {
            await this.stockPartRepositry
                .createQueryBuilder()
                .update(stock_part_entity_1.StockPart)
                .set({ bin: () => data.bin })
                .where('id IN (:...ids)', { ids: stockPart.map(p => p.id) })
                .execute();
        }
        const transfert = await this.transfertRepositry.findOne({
            where: { id },
            relations: ['repair', 'stockPart'],
        });
        if (!transfert) {
            throw new common_1.NotFoundException('Transfert Not found for update = failed');
        }
        Object.assign(transfert, data);
        transfert.repair = repair;
        transfert.stockPart = stockPart;
        return await this.transfertRepositry.save(transfert);
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
    async getFromBranch(branchId, type) {
        const transferts = await this.transfertRepositry
            .createQueryBuilder('transfert')
            .leftJoinAndSelect('transfert.stockPart', 'stockPart')
            .leftJoinAndSelect('stockPart.reference', 'reference')
            .leftJoinAndSelect('reference.allpart', 'allpart')
            .leftJoinAndSelect('reference.model', 'model')
            .leftJoinAndSelect('stockPart.bin', 'bin')
            .where('transfert.frombranch = :branchId', { branchId })
            .andWhere('transfert.type = :type', { type })
            .getMany();
        if (!transferts || transferts.length === 0) {
            throw new common_1.NotFoundException('There is no data available');
        }
        const result = [];
        for (const t of transferts) {
            const [sendUser, receiveUser, fromBranch, toBranch] = await Promise.all([
                this.userRepositry.findOne({ where: { id: t.sendUser } }),
                t.receiveUser ? this.userRepositry.findOne({ where: { id: t.receiveUser } }) : null,
                this.branchRepositry.findOne({ where: { id: t.frombranch } }),
                this.branchRepositry.findOne({ where: { id: t.tobranch } }),
            ]);
            const stockPartsDetail = t.stockPart.map(sp => ({
                id: sp.id,
                serialnumber: sp.serialnumber,
                remark: sp.remark,
                binName: sp.bin?.name ?? null,
                materialCode: sp.reference?.materialCode ?? null,
                model: sp.reference?.model ?? null,
                partDescription: sp.reference?.allpart?.description ?? null,
            }));
            result.push({
                delivredBy: t.delivredBy,
                transfertId: t.id,
                sendingDate: t.sendingDate,
                receivedDate: t.receivedDate,
                type: t.type,
                state: t.state,
                remark: t.remark,
                sendUserName: sendUser?.name || null,
                receiveUserName: receiveUser?.name || null,
                fromBranchName: fromBranch?.name || null,
                toBranchName: toBranch?.name || null,
                stockPart: stockPartsDetail
            });
        }
        return result;
    }
    async getToBranch(branchId, type, state) {
        const transferts = await this.transfertRepositry
            .createQueryBuilder('transfert')
            .leftJoinAndSelect('transfert.stockPart', 'stockPart')
            .leftJoinAndSelect('stockPart.reference', 'reference')
            .leftJoinAndSelect('reference.allpart', 'allpart')
            .leftJoinAndSelect('reference.model', 'model')
            .leftJoinAndSelect('stockPart.bin', 'bin')
            .where('transfert.tobranch = :branchId', { branchId })
            .andWhere('transfert.type = :type', { type })
            .andWhere('transfert.state = :state', { state })
            .getMany();
        if (!transferts || transferts.length === 0) {
            throw new common_1.NotFoundException('There is no data available');
        }
        const result = [];
        for (const t of transferts) {
            const [sendUser, receiveUser, fromBranch, toBranch] = await Promise.all([
                this.userRepositry.findOne({ where: { id: t.sendUser } }),
                t.receiveUser ? this.userRepositry.findOne({ where: { id: t.receiveUser } }) : null,
                this.branchRepositry.findOne({ where: { id: t.frombranch } }),
                this.branchRepositry.findOne({ where: { id: t.tobranch } }),
            ]);
            const stockPartsDetail = t.stockPart.map(sp => ({
                id: sp.id,
                serialnumber: sp.serialnumber,
                remark: sp.remark,
                binName: sp.bin?.name ?? null,
                materialCode: sp.reference?.materialCode ?? null,
                model: sp.reference?.model ?? null,
                partDescription: sp.reference?.allpart?.description ?? null,
            }));
            result.push({
                delivredBy: t.delivredBy,
                transfertId: t.id,
                sendingDate: t.sendingDate,
                receivedDate: t.receivedDate,
                type: t.type,
                state: t.state,
                remark: t.remark,
                sendUserName: sendUser?.name || null,
                receiveUserName: receiveUser?.name || null,
                fromBranchName: fromBranch?.name || null,
                toBranchName: toBranch?.name || null,
                stockPart: stockPartsDetail
            });
        }
        return result;
    }
};
exports.TransfertService = TransfertService;
exports.TransfertService = TransfertService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transfert_entity_1.Transfert)),
    __param(1, (0, typeorm_1.InjectRepository)(stock_part_entity_1.StockPart)),
    __param(2, (0, typeorm_1.InjectRepository)(repair_entity_1.Repair)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TransfertService);
//# sourceMappingURL=transfert.service.js.map