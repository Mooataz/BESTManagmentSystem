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
exports.RepairActionService = void 0;
const common_1 = require("@nestjs/common");
const repair_action_entity_1 = require("./entities/repair-action.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let RepairActionService = class RepairActionService {
    repairActionRepositry;
    constructor(repairActionRepositry) {
        this.repairActionRepositry = repairActionRepositry;
    }
    async create(createRepairActionDto) {
        return await this.repairActionRepositry.save(createRepairActionDto);
    }
    async findAll() {
        const allfind = await this.repairActionRepositry.find();
        if (!allfind || allfind.length === 0) {
            throw new common_1.NotFoundException("There is no data available");
        }
        return allfind;
    }
    async findOne(id) {
        const Onefind = await this.repairActionRepositry.findOne({ where: { id } });
        if (!Onefind) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return Onefind;
    }
    async update(id, updateRepairActionDto) {
        await this.repairActionRepositry.update(id, updateRepairActionDto);
        const updatedata = await this.repairActionRepositry.findOne({ where: { id } });
        if (!updatedata) {
            throw new common_1.NotFoundException('data Not found for update = failed');
        }
        return updatedata;
    }
    async remove(id) {
        const deletedata = await this.repairActionRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('data Not found for delete = failed');
        }
        await this.repairActionRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
};
exports.RepairActionService = RepairActionService;
exports.RepairActionService = RepairActionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(repair_action_entity_1.RepairAction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RepairActionService);
//# sourceMappingURL=repair-action.service.js.map