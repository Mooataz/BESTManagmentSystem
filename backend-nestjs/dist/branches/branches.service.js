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
exports.BranchesService = void 0;
const common_1 = require("@nestjs/common");
const branch_entity_1 = require("./entities/branch.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const app_service_1 = require("../app.service");
const company_entity_1 = require("../company/entities/company.entity");
let BranchesService = class BranchesService {
    branchRepositry;
    companyRepositry;
    appService;
    constructor(branchRepositry, companyRepositry, appService) {
        this.branchRepositry = branchRepositry;
        this.companyRepositry = companyRepositry;
        this.appService = appService;
    }
    async create(createBranchDto) {
        createBranchDto.name = this.appService.cleanSpaces(createBranchDto.name);
        createBranchDto.location = this.appService.cleanSpaces(createBranchDto.location);
        const company = await this.companyRepositry.findOne({ where: { id: createBranchDto.company } });
        if (!company) {
            throw new common_1.NotFoundException('Pas de relation société');
        }
        return await this.branchRepositry.save({ ...createBranchDto, company });
    }
    async findAll() {
        const allfind = await this.branchRepositry.find({
            relations: ['company', 'user', 'bin'],
        });
        if (!allfind || allfind.length === 0) {
            throw new common_1.NotFoundException("There is no data available");
        }
        return allfind;
    }
    async findOne(id) {
        const Onefind = await this.branchRepositry.findOne({ where: { id } });
        if (!Onefind) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return Onefind;
    }
    async update(id, updateBranchDto) {
        const existingBranch = await this.branchRepositry.findOne({ where: { id } });
        if (!existingBranch) {
            throw new common_1.NotFoundException('Repair not found');
        }
        let company = undefined;
        if (updateBranchDto.company !== undefined) {
            const foundCompany = await this.companyRepositry.findOne({ where: { id: updateBranchDto.company } });
            if (!foundCompany) {
                throw new common_1.NotFoundException('Company not found');
            }
            company = foundCompany;
        }
        const updateData = {
            ...updateBranchDto,
            company: company ?? existingBranch.company,
        };
        delete updateData.company;
        await this.branchRepositry.update(id, updateData);
        return this.branchRepositry.findOneOrFail({
            where: { id },
            relations: ['company']
        });
    }
    async remove(id) {
        const deletedata = await this.branchRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('data Not found for delete = failed');
        }
        await this.branchRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
};
exports.BranchesService = BranchesService;
exports.BranchesService = BranchesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        app_service_1.AppService])
], BranchesService);
//# sourceMappingURL=branches.service.js.map