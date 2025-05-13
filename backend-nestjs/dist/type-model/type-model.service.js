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
exports.TypeModelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const type_model_entity_1 = require("./entities/type-model.entity");
const typeorm_2 = require("typeorm");
const app_service_1 = require("../app.service");
let TypeModelService = class TypeModelService {
    typeModelRepositry;
    appService;
    constructor(typeModelRepositry, appService) {
        this.typeModelRepositry = typeModelRepositry;
        this.appService = appService;
    }
    async create(createTypeModelDto) {
        createTypeModelDto.description = this.appService.cleanSpaces(createTypeModelDto.description);
        return await this.typeModelRepositry.save(createTypeModelDto);
    }
    async findAll() {
        const findAll = await this.typeModelRepositry.find();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException('No Type model found');
        }
        return findAll;
    }
    async findOne(id) {
        const findOne = await this.typeModelRepositry.findOne({ where: { id } });
        if (!findOne) {
            throw new common_1.NotFoundException('No type available');
        }
        return findOne;
    }
    async update(id, updateTypeModelDto) {
        await this.typeModelRepositry.update(id, updateTypeModelDto);
        const updateData = await this.typeModelRepositry.findOne({ where: { id } });
        if (!updateData) {
            throw new common_1.NotFoundException('Type not found to update');
        }
        return updateData;
    }
    async remove(id) {
        const deletedata = await this.typeModelRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('Type not found for delete');
        }
        await this.typeModelRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
};
exports.TypeModelService = TypeModelService;
exports.TypeModelService = TypeModelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(type_model_entity_1.TypeModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        app_service_1.AppService])
], TypeModelService);
//# sourceMappingURL=type-model.service.js.map