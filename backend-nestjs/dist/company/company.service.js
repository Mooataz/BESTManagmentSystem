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
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const company_entity_1 = require("./entities/company.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const app_service_1 = require("../app.service");
let CompanyService = class CompanyService {
    companyRepositry;
    appService;
    constructor(companyRepositry, appService) {
        this.companyRepositry = companyRepositry;
        this.appService = appService;
    }
    async create(createCompanyDto) {
        createCompanyDto.name = this.appService.cleanSpaces(createCompanyDto.name);
        createCompanyDto.bank = this.appService.cleanSpaces(createCompanyDto.bank);
        createCompanyDto.headquarterslocation = this.appService.cleanSpaces(createCompanyDto.headquarterslocation);
        createCompanyDto.taxRegisterNumber = this.appService.cleanSpaces(createCompanyDto.taxRegisterNumber);
        return await this.companyRepositry.save(createCompanyDto);
    }
    async findAll() {
        const comp = await this.companyRepositry.find();
        if (!comp || comp.length === 0) {
            throw new common_1.NotFoundException("There is no user sata Available");
        }
        return comp;
    }
    async findOne(id) {
        const OneBrand = await this.companyRepositry.findOne({ where: { id } });
        if (!OneBrand) {
            throw new common_1.NotFoundException("There is no brand data Available");
        }
        return OneBrand;
    }
    async update(id, updateCompanyDto) {
        await this.companyRepositry.update(id, updateCompanyDto);
        const updatedata = await this.companyRepositry.findOne({ where: { id } });
        if (!updatedata) {
            throw new common_1.NotFoundException('Company not found for update');
        }
        return updatedata;
    }
    async remove(id) {
        const deletedata = await this.companyRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('Brand Not found for delete = failed');
        }
        await this.companyRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        app_service_1.AppService])
], CompanyService);
//# sourceMappingURL=company.service.js.map