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
exports.Brand = void 0;
const level_repair_entity_1 = require("../../level-repair/entities/level-repair.entity");
const model_entity_1 = require("../../models/entities/model.entity");
const typeorm_1 = require("typeorm");
let Brand = class Brand {
    id;
    name;
    logo;
    status;
    Model;
    levelRepair;
};
exports.Brand = Brand;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Brand.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Brand.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Brand.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Brand.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => model_entity_1.Model, Model => Model.brand),
    __metadata("design:type", model_entity_1.Model)
], Brand.prototype, "Model", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => level_repair_entity_1.LevelRepair, (levelRepair) => levelRepair.brand),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", level_repair_entity_1.LevelRepair)
], Brand.prototype, "levelRepair", void 0);
exports.Brand = Brand = __decorate([
    (0, typeorm_1.Entity)()
], Brand);
//# sourceMappingURL=brand.entity.js.map