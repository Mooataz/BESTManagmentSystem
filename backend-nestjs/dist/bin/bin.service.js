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
exports.BinService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bin_entity_1 = require("./entities/bin.entity");
const typeorm_2 = require("typeorm");
const branch_entity_1 = require("../branches/entities/branch.entity");
const app_service_1 = require("../app.service");
let BinService = class BinService {
    binRepositry;
    branchRepositry;
    appService;
    constructor(binRepositry, branchRepositry, appService) {
        this.binRepositry = binRepositry;
        this.branchRepositry = branchRepositry;
        this.appService = appService;
    }
    async create(createBinDto) {
        createBinDto.name = this.appService.cleanSpaces(createBinDto.name);
        const branch = await this.branchRepositry.findOne({ where: { id: createBinDto.branch } });
        if (!branch) {
            throw new common_1.NotFoundException('No branch');
        }
        ;
        const newCreate = this.binRepositry.create({ ...createBinDto, branch });
        return await this.binRepositry.save(newCreate);
    }
    async findAll() {
        const findAll = await this.binRepositry.find();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException('No Bin model found');
        }
        return findAll;
    }
    async findOne(id) {
        const findOne = await this.binRepositry.findOne({ where: { id } });
        if (!findOne) {
            throw new common_1.NotFoundException('No Bin available');
        }
        return findOne;
    }
    async update(id, updateBinDto) {
        const { branch, ...rest } = updateBinDto;
        let updateData = { ...rest };
        if (updateBinDto.branch !== undefined) {
            const branch = await this.branchRepositry.findOne({ where: { id: updateBinDto.branch } });
            if (!branch) {
                throw new common_1.NotFoundException('No branch found');
            }
            updateData.branch = branch;
        }
        await this.binRepositry.update(id, updateData);
        const updatedBin = await this.binRepositry.findOne({ where: { id }, relations: ['branch'] });
        if (!updatedBin) {
            throw new common_1.NotFoundException('Reference not found to update');
        }
        return updatedBin;
    }
    async remove(id) {
        const deletedata = await this.binRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('Bin not found for delete');
        }
        await this.binRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
    async findByBranchId(branchId) {
        return this.binRepositry
            .createQueryBuilder('bin')
            .leftJoinAndSelect('bin.branch', 'branch')
            .where('branch.id = :branchId', { branchId })
            .getMany();
    }
    async findByBranchIdAndType(branchId, type) {
        return this.binRepositry
            .createQueryBuilder('bin')
            .leftJoinAndSelect('bin.branch', 'branch')
            .where('branch.id = :branchId', { branchId })
            .andWhere('bin.type = :type', { type })
            .getMany();
    }
};
exports.BinService = BinService;
exports.BinService = BinService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bin_entity_1.Bin)),
    __param(1, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        app_service_1.AppService])
], BinService);
//# sourceMappingURL=bin.service.js.map