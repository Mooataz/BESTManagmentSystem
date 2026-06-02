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
exports.OtherCostService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const other_cost_entity_1 = require("./entities/other-cost.entity");
const typeorm_2 = require("typeorm");
const app_service_1 = require("../app.service");
let OtherCostService = class OtherCostService {
    otherCostRepositry;
    appService;
    constructor(otherCostRepositry, appService) {
        this.otherCostRepositry = otherCostRepositry;
        this.appService = appService;
    }
    async create(createOtherCostDto) {
        createOtherCostDto.name = this.appService.cleanSpaces(createOtherCostDto.name);
        return await this.otherCostRepositry.save(createOtherCostDto);
    }
    async findAll() {
        const allfind = await this.otherCostRepositry.find();
        if (!allfind || allfind.length === 0) {
            throw new common_1.NotFoundException("There is no data available");
        }
        return allfind;
    }
    async findOne(id) {
        const Onefind = await this.otherCostRepositry.findOne({ where: { id } });
        if (!Onefind) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return Onefind;
    }
    async update(id, updateOtherCostDto) {
        await this.otherCostRepositry.update(id, updateOtherCostDto);
        const updatedata = await this.otherCostRepositry.findOne({ where: { id } });
        if (!updatedata) {
            throw new common_1.NotFoundException('data Not found for update = failed');
        }
        return updatedata;
    }
    async remove(id) {
        const deletedata = await this.otherCostRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('data Not found for delete = failed');
        }
        await this.otherCostRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
};
exports.OtherCostService = OtherCostService;
exports.OtherCostService = OtherCostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(other_cost_entity_1.OtherCost)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        app_service_1.AppService])
], OtherCostService);
//# sourceMappingURL=other-cost.service.js.map