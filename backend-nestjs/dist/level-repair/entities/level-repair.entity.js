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
exports.LevelRepair = void 0;
const brand_entity_1 = require("../../brands/entities/brand.entity");
const parts_price_entity_1 = require("../../parts-price/entities/parts-price.entity");
const typeorm_1 = require("typeorm");
let LevelRepair = class LevelRepair {
    id;
    name;
    price;
    brand;
    partsPrice;
};
exports.LevelRepair = LevelRepair;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LevelRepair.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LevelRepair.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], LevelRepair.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => brand_entity_1.Brand, (brand) => brand.levelRepair),
    __metadata("design:type", brand_entity_1.Brand)
], LevelRepair.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => parts_price_entity_1.PartsPrice, (partsPrice) => partsPrice.levelRepair),
    __metadata("design:type", parts_price_entity_1.PartsPrice)
], LevelRepair.prototype, "partsPrice", void 0);
exports.LevelRepair = LevelRepair = __decorate([
    (0, typeorm_1.Entity)()
], LevelRepair);
//# sourceMappingURL=level-repair.entity.js.map