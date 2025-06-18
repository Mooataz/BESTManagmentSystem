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
exports.Model = void 0;
const all_part_entity_1 = require("../../all-parts/entities/all-part.entity");
const brand_entity_1 = require("../../brands/entities/brand.entity");
const device_entity_1 = require("../../devices/entities/device.entity");
const parts_price_entity_1 = require("../../parts-price/entities/parts-price.entity");
const reference_entity_1 = require("../../references/entities/reference.entity");
const type_model_entity_1 = require("../../type-model/entities/type-model.entity");
const typeorm_1 = require("typeorm");
let Model = class Model {
    id;
    name;
    picture;
    brand;
    typeModel;
    device;
    reference;
    allpart;
    partsPrice;
};
exports.Model = Model;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Model.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Model.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Model.prototype, "picture", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => brand_entity_1.Brand, Brand => Brand.model, { cascade: true }),
    __metadata("design:type", brand_entity_1.Brand)
], Model.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => type_model_entity_1.TypeModel, typeModel => typeModel.model, { cascade: true }),
    __metadata("design:type", type_model_entity_1.TypeModel)
], Model.prototype, "typeModel", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => device_entity_1.Device, device => device.model),
    __metadata("design:type", Array)
], Model.prototype, "device", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => reference_entity_1.Reference, reference => reference.model),
    __metadata("design:type", reference_entity_1.Reference)
], Model.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => all_part_entity_1.AllPart, (allpart) => allpart.model, { cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Model.prototype, "allpart", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => parts_price_entity_1.PartsPrice, (partPrice) => partPrice.model),
    __metadata("design:type", Array)
], Model.prototype, "partsPrice", void 0);
exports.Model = Model = __decorate([
    (0, typeorm_1.Entity)()
], Model);
//# sourceMappingURL=model.entity.js.map