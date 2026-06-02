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
exports.HistoryRepairService = void 0;
const common_1 = require("@nestjs/common");
const history_repair_entity_1 = require("./entities/history-repair.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const repair_entity_1 = require("../repair/entities/repair.entity");
const tracability_entity_1 = require("../tracability/entities/tracability.entity");
const user_entity_1 = require("../users/entities/user.entity");
let HistoryRepairService = class HistoryRepairService {
    historyRepairRepositry;
    repairRepositry;
    tracabilityRepositry;
    userRepositry;
    constructor(historyRepairRepositry, repairRepositry, tracabilityRepositry, userRepositry) {
        this.historyRepairRepositry = historyRepairRepositry;
        this.repairRepositry = repairRepositry;
        this.tracabilityRepositry = tracabilityRepositry;
        this.userRepositry = userRepositry;
    }
    async create(data) {
        const repair = await this.repairRepositry.findOne({ where: { id: data.repair } });
        if (!repair)
            throw new common_1.NotFoundException('repair not found');
        const user = await this.userRepositry.findOne({ where: { id: data.user?.id } });
        if (!user)
            throw new common_1.NotFoundException('user not found');
        const createHistoryRepairDto = {
            step: data.step,
            date: data.date,
            repair: data.repair
        };
        const newCreate = this.historyRepairRepositry.create(createHistoryRepairDto);
        const saveHist = await this.historyRepairRepositry.save(newCreate);
        const tracData = {
            user: user,
            historyRepair: saveHist
        };
        const newTrac = await this.tracabilityRepositry.create(tracData);
        await this.tracabilityRepositry.save(newTrac);
        return saveHist;
    }
    async findAll() {
        const allfind = await this.historyRepairRepositry.find();
        if (!allfind || allfind.length === 0) {
            throw new common_1.NotFoundException("There is no data available");
        }
        return allfind;
    }
    async findOne(id) {
        const Onefind = await this.historyRepairRepositry.findOne({ where: { id } });
        if (!Onefind) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return Onefind;
    }
    async update(id, updateHistoryRepairDto) {
        let repair = undefined;
        if (updateHistoryRepairDto.repair !== undefined) {
            const foundRepair = await this.repairRepositry.findOne({ where: { id: updateHistoryRepairDto.repair } });
            if (!foundRepair) {
                throw new common_1.NotFoundException('Repair not found');
            }
            repair = foundRepair;
        }
        const updateData = {
            ...updateHistoryRepairDto,
            repair: repair
        };
        await this.historyRepairRepositry.update(id, updateData);
        const updatedata = await this.historyRepairRepositry.findOne({ where: { id } });
        if (!updatedata) {
            throw new common_1.NotFoundException('data Not found for update = failed');
        }
        return updatedata;
    }
    async remove(id) {
        const deletedata = await this.historyRepairRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('data Not found for delete = failed');
        }
        await this.historyRepairRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
    async findByRepairId(repairId) {
        return this.historyRepairRepositry
            .createQueryBuilder('historyRepair')
            .leftJoinAndSelect('historyRepair.repair', 'repair')
            .where('repair.id = :repairId', { repairId })
            .getMany();
    }
};
exports.HistoryRepairService = HistoryRepairService;
exports.HistoryRepairService = HistoryRepairService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(history_repair_entity_1.HistoryRepair)),
    __param(1, (0, typeorm_2.InjectRepository)(repair_entity_1.Repair)),
    __param(2, (0, typeorm_2.InjectRepository)(tracability_entity_1.Tracability)),
    __param(3, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], HistoryRepairService);
//# sourceMappingURL=history-repair.service.js.map