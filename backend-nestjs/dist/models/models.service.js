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
exports.ModelsService = void 0;
const common_1 = require("@nestjs/common");
const model_entity_1 = require("./entities/model.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const all_part_entity_1 = require("../all-parts/entities/all-part.entity");
const app_service_1 = require("../app.service");
let ModelsService = class ModelsService {
    modelRepositry;
    allPartRepositry;
    appService;
    constructor(modelRepositry, allPartRepositry, appService) {
        this.modelRepositry = modelRepositry;
        this.allPartRepositry = allPartRepositry;
        this.appService = appService;
    }
    async create(createModelDto) {
        createModelDto.name = this.appService.cleanSpaces(createModelDto.name);
        const allpart = await this.allPartRepositry.find({ where: { id: (0, typeorm_2.In)(createModelDto.allpartIds) } });
        const createNew = this.modelRepositry.create({ ...createModelDto, allpart });
        return await this.modelRepositry.save(createNew);
    }
    async findAll() {
        const findAll = await this.modelRepositry.find({
            relations: ['allpart'],
        });
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException('No models found');
        }
        return findAll;
    }
    async findOne(id) {
        const findOne = await this.modelRepositry.findOne({ where: { id } });
        if (!findOne) {
            throw new common_1.NotFoundException('No model found');
        }
        return findOne;
    }
    async update(id, updateModelDto) {
        await this.modelRepositry.update(id, updateModelDto);
        const updatedata = await this.modelRepositry.findOne({ where: { id } });
        if (!updatedata) {
            throw new common_1.NotFoundException('Model not found for update');
        }
        return updatedata;
    }
    async remove(id) {
        const deletedata = await this.modelRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('Brand Not found for delete = failed');
        }
        await this.modelRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
    async findByBrandId(brandId) {
        const findAll = await this.modelRepositry
            .createQueryBuilder("model")
            .leftJoinAndSelect("model.brand", "brand")
            .where("brand.id = :brandId", { brandId })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findByTypeModelId(typeModelId) {
        const findAll = await this.modelRepositry
            .createQueryBuilder("model")
            .leftJoinAndSelect("model.typeModel", "typeModel")
            .where("typeModel.id = :typeModelId", { typeModelId })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
};
exports.ModelsService = ModelsService;
exports.ModelsService = ModelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(model_entity_1.Model)),
    __param(1, (0, typeorm_1.InjectRepository)(all_part_entity_1.AllPart)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        app_service_1.AppService])
], ModelsService);
//# sourceMappingURL=models.service.js.map