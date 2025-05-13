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
exports.PartsPriceService = void 0;
const common_1 = require("@nestjs/common");
const parts_price_entity_1 = require("./entities/parts-price.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const model_entity_1 = require("../models/entities/model.entity");
const all_part_entity_1 = require("../all-parts/entities/all-part.entity");
const level_repair_entity_1 = require("../level-repair/entities/level-repair.entity");
let PartsPriceService = class PartsPriceService {
    partsPriceRepositry;
    modelRepositry;
    allPartRepositry;
    levelRepairRepositry;
    constructor(partsPriceRepositry, modelRepositry, allPartRepositry, levelRepairRepositry) {
        this.partsPriceRepositry = partsPriceRepositry;
        this.modelRepositry = modelRepositry;
        this.allPartRepositry = allPartRepositry;
        this.levelRepairRepositry = levelRepairRepositry;
    }
    async create(createPartsPriceDto) {
        const model = await this.modelRepositry.findOne({ where: { id: createPartsPriceDto.modelId }, });
        if (!model) {
            throw new common_1.NotFoundException(`Model with ID ${createPartsPriceDto.modelId} not found`);
        }
        const allPart = await this.allPartRepositry.findOne({ where: { id: createPartsPriceDto.allPartId }, });
        if (!allPart) {
            throw new common_1.NotFoundException(`AllPart with ID ${createPartsPriceDto.allPartId} not found`);
        }
        const levelRepair = await this.levelRepairRepositry.findOne({ where: { id: createPartsPriceDto.laborCharge } });
        if (!levelRepair) {
            throw new common_1.NotFoundException('Level repair not found');
        }
        ;
        const partsPrice = this.partsPriceRepositry.create({ ...createPartsPriceDto, model, allPart, levelRepair });
        return this.partsPriceRepositry.save(partsPrice);
    }
    async findAll() {
        const findAll = await this.partsPriceRepositry.find();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException('No data found');
        }
        return findAll;
    }
    async findOne(id) {
        const findOne = await this.partsPriceRepositry.findOne({ where: { id } });
        if (!findOne) {
            throw new common_1.NotFoundException('No data available');
        }
        return findOne;
    }
    async update(id, updatePartsPriceDto) {
        await this.partsPriceRepositry.update(id, updatePartsPriceDto);
        const updateData = await this.partsPriceRepositry.findOne({ where: { id } });
        if (!updateData) {
            throw new common_1.NotFoundException('Data not found to update');
        }
        return updateData;
    }
    async remove(id) {
        const deletedata = await this.partsPriceRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('Data not found for delete');
        }
        await this.partsPriceRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
    async findByModelallPArt(modelId, allPartId) {
        const find = await this.partsPriceRepositry.findOne({ where: { model: { id: modelId },
                allPart: { id: allPartId }, },
            relations: ['model', 'allPart'], });
        if (!find) {
            throw new common_1.NotFoundException('Data not founded by this Ids');
        }
        return find;
    }
};
exports.PartsPriceService = PartsPriceService;
exports.PartsPriceService = PartsPriceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(parts_price_entity_1.PartsPrice)),
    __param(1, (0, typeorm_1.InjectRepository)(model_entity_1.Model)),
    __param(2, (0, typeorm_1.InjectRepository)(all_part_entity_1.AllPart)),
    __param(3, (0, typeorm_1.InjectRepository)(level_repair_entity_1.LevelRepair)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PartsPriceService);
//# sourceMappingURL=parts-price.service.js.map