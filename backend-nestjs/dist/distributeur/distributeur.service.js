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
exports.DistributeurService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const distributeur_entity_1 = require("./entities/distributeur.entity");
const typeorm_2 = require("typeorm");
const app_service_1 = require("../app.service");
let DistributeurService = class DistributeurService {
    distributeurRepositry;
    appService;
    constructor(distributeurRepositry, appService) {
        this.distributeurRepositry = distributeurRepositry;
        this.appService = appService;
    }
    async create(createDistributeurDto) {
        createDistributeurDto.name = this.appService.cleanSpaces(createDistributeurDto.name);
        createDistributeurDto.taxRegisterNumber = this.appService.cleanSpaces(createDistributeurDto.taxRegisterNumber);
        createDistributeurDto.location = this.appService.cleanSpaces(createDistributeurDto.location);
        const distributeur = this.distributeurRepositry.create(createDistributeurDto);
        return await this.distributeurRepositry.save(distributeur);
    }
    async findAll() {
        const allDistributeurs = await this.distributeurRepositry.find();
        if (!allDistributeurs || allDistributeurs.length === 0) {
            throw new common_1.NotFoundException("There is no distributeurs data Available");
        }
        return allDistributeurs;
    }
    async findOne(id) {
        const OneDistributeur = await this.distributeurRepositry.findOne({ where: { id } });
        if (!OneDistributeur) {
            throw new common_1.NotFoundException("There is no distributeur data Available");
        }
        return OneDistributeur;
    }
    async update(id, updateDistributeurDto) {
        await this.distributeurRepositry.update(id, updateDistributeurDto);
        const updatedata = await this.distributeurRepositry.findOne({ where: { id } });
        if (!updatedata) {
            throw new common_1.NotFoundException('Distributeur Not found for update = failed');
        }
        return updatedata;
    }
    async remove(id) {
        const deletedata = await this.distributeurRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('Distributeur Not found for delete = failed');
        }
        await this.distributeurRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
};
exports.DistributeurService = DistributeurService;
exports.DistributeurService = DistributeurService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(distributeur_entity_1.Distributeur)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        app_service_1.AppService])
], DistributeurService);
//# sourceMappingURL=distributeur.service.js.map