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
exports.AllPartsService = void 0;
const common_1 = require("@nestjs/common");
const all_part_entity_1 = require("./entities/all-part.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const app_service_1 = require("../app.service");
let AllPartsService = class AllPartsService {
    allPartRepositry;
    appService;
    constructor(allPartRepositry, appService) {
        this.allPartRepositry = allPartRepositry;
        this.appService = appService;
    }
    async create(createAllPartDto) {
        createAllPartDto.description = this.appService.cleanSpaces(createAllPartDto.description);
        return await this.allPartRepositry.save(createAllPartDto);
    }
    async findAll() {
        const allfind = await this.allPartRepositry.find();
        if (!allfind || allfind.length === 0) {
            throw new common_1.NotFoundException('There is no data available');
        }
        return allfind;
    }
    async findOne(id) {
        const onefind = await this.allPartRepositry.findOne({ where: { id } });
        if (!onefind) {
            throw new common_1.NotFoundException('No data available');
        }
        return onefind;
    }
    async update(id, updateAllPartDto) {
        await this.allPartRepositry.update(id, updateAllPartDto);
        const updateData = await this.allPartRepositry.findOne({ where: { id } });
        if (!updateData) {
            throw new common_1.NotFoundException('data not found to update');
        }
        return updateData;
    }
    async remove(id) {
        const deletedata = await this.allPartRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('data Not found for delete');
        }
        await this.allPartRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
};
exports.AllPartsService = AllPartsService;
exports.AllPartsService = AllPartsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(all_part_entity_1.AllPart)),
    __metadata("design:paramtypes", [typeorm_2.Repository, app_service_1.AppService])
], AllPartsService);
//# sourceMappingURL=all-parts.service.js.map