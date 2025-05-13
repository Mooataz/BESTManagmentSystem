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
exports.LegislationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const legislation_entity_1 = require("./entities/legislation.entity");
const app_service_1 = require("../app.service");
let LegislationService = class LegislationService {
    legislationRepositry;
    appService;
    constructor(legislationRepositry, appService) {
        this.legislationRepositry = legislationRepositry;
        this.appService = appService;
    }
    async create(createLegislationDto) {
        createLegislationDto.name = this.appService.cleanSpaces(createLegislationDto.name);
        return await this.legislationRepositry.save(createLegislationDto);
    }
    async findAll() {
        const allfind = await this.legislationRepositry.find();
        if (!allfind || allfind.length === 0) {
            throw new common_1.NotFoundException("There is no data available");
        }
        return allfind;
    }
    async findOne(id) {
        const Onefind = await this.legislationRepositry.findOne({ where: { id } });
        if (!Onefind) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return Onefind;
    }
    async update(id, updateLegislationDto) {
        await this.legislationRepositry.update(id, updateLegislationDto);
        const updatedata = await this.legislationRepositry.findOne({ where: { id } });
        if (!updatedata) {
            throw new common_1.NotFoundException('data Not found for update = failed');
        }
        return updatedata;
    }
    async remove(id) {
        const deletedata = await this.legislationRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('data Not found for delete = failed');
        }
        await this.legislationRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
};
exports.LegislationService = LegislationService;
exports.LegislationService = LegislationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(legislation_entity_1.Legislation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        app_service_1.AppService])
], LegislationService);
//# sourceMappingURL=legislation.service.js.map