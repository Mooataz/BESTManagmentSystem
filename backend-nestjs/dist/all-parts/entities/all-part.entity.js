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
exports.AllPart = void 0;
const model_entity_1 = require("../../models/entities/model.entity");
const parts_price_entity_1 = require("../../parts-price/entities/parts-price.entity");
const reference_entity_1 = require("../../references/entities/reference.entity");
const sale_entity_1 = require("../../sales/entities/sale.entity");
const typeorm_1 = require("typeorm");
let AllPart = class AllPart {
    id;
    description;
    model;
    reference;
    partsPrice;
    sale;
};
exports.AllPart = AllPart;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AllPart.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AllPart.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => model_entity_1.Model, (model) => model.allpart),
    __metadata("design:type", Array)
], AllPart.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reference_entity_1.Reference, (reference) => reference.allpart),
    __metadata("design:type", Array)
], AllPart.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => parts_price_entity_1.PartsPrice, (partsPrice) => partsPrice.allPart),
    __metadata("design:type", Array)
], AllPart.prototype, "partsPrice", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => sale_entity_1.Sale, (sale) => sale.allPart),
    __metadata("design:type", Array)
], AllPart.prototype, "sale", void 0);
exports.AllPart = AllPart = __decorate([
    (0, typeorm_1.Entity)()
], AllPart);
//# sourceMappingURL=all-part.entity.js.map