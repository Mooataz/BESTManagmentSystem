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
const type_model_entity_1 = require("../type-model/entities/type-model.entity");
const brand_entity_1 = require("../brands/entities/brand.entity");
const all_part_entity_1 = require("../all-parts/entities/all-part.entity");
const app_service_1 = require("../app.service");
let ModelsService = class ModelsService {
    modelRepositry;
    allPartRepositry;
    brandRepositry;
    typeModelRepositry;
    appService;
    constructor(modelRepositry, allPartRepositry, brandRepositry, typeModelRepositry, appService) {
        this.modelRepositry = modelRepositry;
        this.allPartRepositry = allPartRepositry;
        this.brandRepositry = brandRepositry;
        this.typeModelRepositry = typeModelRepositry;
        this.appService = appService;
    }
    async create(createModelDto) {
        createModelDto.name = this.appService.cleanSpaces(createModelDto.name);
        const brand = createModelDto.brand ? await this.brandRepositry.findOne({ where: { id: createModelDto.brand } }) : undefined;
        if (!brand) {
            throw new common_1.NotFoundException("No valid brand found.");
        }
        const typeModel = createModelDto.brand ? await this.typeModelRepositry.findOne({ where: { id: createModelDto.typeModel } }) : undefined;
        if (!typeModel) {
            throw new common_1.NotFoundException("No Type model found.");
        }
        const allpart = await this.allPartRepositry.find({ where: { id: (0, typeorm_2.In)(createModelDto.allpartIds) } });
        const createNew = this.modelRepositry.create({ ...createModelDto, brand, allpart, typeModel });
        return await this.modelRepositry.save(createNew);
    }
    async findAll() {
        const findAll = await this.modelRepositry.find({
            relations: ['allpart', 'brand', 'typeModel'],
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
        const existingModel = await this.modelRepositry.findOne({
            where: { id },
            relations: ['brand', 'typeModel', 'allpart']
        });
        if (!existingModel) {
            throw new common_1.NotFoundException('Model not found');
        }
        const updateData = {};
        if (updateModelDto.name) {
            updateData.name = this.appService.cleanSpaces(updateModelDto.name);
        }
        if (updateModelDto.picture) {
            updateData.picture = updateModelDto.picture;
        }
        if (updateModelDto.brand) {
            const brand = await this.brandRepositry.findOne({
                where: { id: updateModelDto.brand }
            });
            if (!brand) {
                throw new common_1.NotFoundException("No valid brand found.");
            }
            updateData.brand = brand;
        }
        if (updateModelDto.typeModel) {
            const typeModel = await this.typeModelRepositry.findOne({
                where: { id: updateModelDto.typeModel }
            });
            if (!typeModel) {
                throw new common_1.NotFoundException("No Type model found.");
            }
            updateData.typeModel = typeModel;
        }
        if (updateModelDto.allpartIds) {
            const allpart = await this.allPartRepositry.find({
                where: { id: (0, typeorm_2.In)(updateModelDto.allpartIds) }
            });
            existingModel.allpart = allpart;
        }
        Object.assign(existingModel, updateData);
        return await this.modelRepositry.save(existingModel);
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
    async findByBrandAuthorised() {
        const allModels = await this.modelRepositry.find({
            relations: ['brand', 'typeModel', 'allpart']
        });
        const filtered = allModels.filter(model => model.brand?.status === 'Autoriser');
        return filtered;
    }
};
exports.ModelsService = ModelsService;
exports.ModelsService = ModelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(model_entity_1.Model)),
    __param(1, (0, typeorm_1.InjectRepository)(all_part_entity_1.AllPart)),
    __param(2, (0, typeorm_1.InjectRepository)(brand_entity_1.Brand)),
    __param(3, (0, typeorm_1.InjectRepository)(type_model_entity_1.TypeModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        app_service_1.AppService])
], ModelsService);
//# sourceMappingURL=models.service.js.map