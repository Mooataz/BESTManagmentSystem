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
exports.ReferencesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reference_entity_1 = require("./entities/reference.entity");
const typeorm_2 = require("typeorm");
const model_entity_1 = require("../models/entities/model.entity");
const all_part_entity_1 = require("../all-parts/entities/all-part.entity");
const app_service_1 = require("../app.service");
let ReferencesService = class ReferencesService {
    referenceRepositry;
    modelRepositry;
    allPartRepositry;
    appService;
    constructor(referenceRepositry, modelRepositry, allPartRepositry, appService) {
        this.referenceRepositry = referenceRepositry;
        this.modelRepositry = modelRepositry;
        this.allPartRepositry = allPartRepositry;
        this.appService = appService;
    }
    async create(createReferenceDto) {
        createReferenceDto.materialCode = this.appService.cleanSpaces(createReferenceDto.materialCode);
        createReferenceDto.description = this.appService.cleanSpaces(createReferenceDto.description);
        const model = await this.modelRepositry.find({ where: { id: (0, typeorm_2.In)(createReferenceDto.modelIds) }, });
        if (!model.length) {
            throw new common_1.NotFoundException('No model');
        }
        ;
        const allpart = await this.allPartRepositry.findOne({ where: { id: createReferenceDto.allpart }, });
        if (!allpart) {
            throw new common_1.NotFoundException('No part');
        }
        ;
        const createNew = this.referenceRepositry.create({ ...createReferenceDto, model, allpart });
        return await this.referenceRepositry.save(createNew);
    }
    async findAll() {
        const findAll = await this.referenceRepositry.find();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException('No Reference found');
        }
        return findAll;
    }
    async findOne(id) {
        const findOne = await this.referenceRepositry.findOne({ where: { id } });
        if (!findOne) {
            throw new common_1.NotFoundException('No Reference available');
        }
        return findOne;
    }
    async update(id, updateReferenceDto) {
        const { allpart, modelIds, ...rest } = updateReferenceDto;
        let updateData = { ...rest };
        if (updateReferenceDto.allpart !== undefined) {
            const allpart = await this.allPartRepositry.findOne({ where: { id: updateReferenceDto.allpart } });
            if (!allpart) {
                throw new common_1.NotFoundException('No part found');
            }
            updateData.allpart = allpart;
        }
        await this.referenceRepositry.update(id, updateData);
        const updatedReference = await this.referenceRepositry.findOne({ where: { id }, relations: ['allpart'] });
        if (!updatedReference) {
            throw new common_1.NotFoundException('Reference not found to update');
        }
        return updatedReference;
    }
    async remove(id) {
        const deletedata = await this.referenceRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('Reference not found for delete');
        }
        await this.referenceRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
    async findCompatibleReferences(modelId, partId) {
        const references = await this.referenceRepositry
            .createQueryBuilder('reference')
            .leftJoinAndSelect('reference.model', 'model')
            .leftJoinAndSelect('reference.allpart', 'allpart')
            .where('allpart.id = :partId', { partId })
            .andWhere('model.id = :modelId', { modelId })
            .getMany();
        if (!references.length) {
            throw new common_1.NotFoundException('Reference not found');
        }
        return references;
    }
    async findByMaterialCode(materialCode) {
        const references = await this.referenceRepositry
            .createQueryBuilder('reference')
            .andWhere('materialCode = :materialCode', { materialCode })
            .getMany();
        if (!references.length) {
            throw new common_1.NotFoundException('Reference not found');
        }
        return references;
    }
};
exports.ReferencesService = ReferencesService;
exports.ReferencesService = ReferencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reference_entity_1.Reference)),
    __param(1, (0, typeorm_1.InjectRepository)(model_entity_1.Model)),
    __param(2, (0, typeorm_1.InjectRepository)(all_part_entity_1.AllPart)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        app_service_1.AppService])
], ReferencesService);
//# sourceMappingURL=references.service.js.map