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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartsPrice = void 0;
const all_part_entity_1 = require("../../all-parts/entities/all-part.entity");
const level_repair_entity_1 = require("../../level-repair/entities/level-repair.entity");
const model_entity_1 = require("../../models/entities/model.entity");
const typeorm_1 = require("typeorm");
let PartsPrice = class PartsPrice {
    id;
    price;
    model;
    allPart;
    levelRepair;
};
exports.PartsPrice = PartsPrice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PartsPrice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], PartsPrice.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => model_entity_1.Model, (model) => model.partsPrice),
    __metadata("design:type", model_entity_1.Model)
], PartsPrice.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => all_part_entity_1.AllPart, (allPart) => allPart.partsPrice),
    __metadata("design:type", all_part_entity_1.AllPart)
], PartsPrice.prototype, "allPart", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => level_repair_entity_1.LevelRepair, (levelRepair) => levelRepair.partsPrice),
    __metadata("design:type", level_repair_entity_1.LevelRepair)
], PartsPrice.prototype, "levelRepair", void 0);
exports.PartsPrice = PartsPrice = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['allPart', 'model'])
], PartsPrice);
//# sourceMappingURL=parts-price.entity.js.map