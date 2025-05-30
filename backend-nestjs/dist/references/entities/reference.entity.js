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
exports.Reference = void 0;
const all_part_entity_1 = require("../../all-parts/entities/all-part.entity");
const model_entity_1 = require("../../models/entities/model.entity");
const stock_part_entity_1 = require("../../stock-parts/entities/stock-part.entity");
const typeorm_1 = require("typeorm");
let Reference = class Reference {
    id;
    materialCode;
    description;
    stockPart;
    model;
    allpart;
};
exports.Reference = Reference;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Reference.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Reference.prototype, "materialCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reference.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_part_entity_1.StockPart, stockPart => stockPart.reference),
    __metadata("design:type", Array)
], Reference.prototype, "stockPart", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => model_entity_1.Model, (model) => model.reference, { cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Reference.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => all_part_entity_1.AllPart, (allpart) => allpart.reference),
    __metadata("design:type", all_part_entity_1.AllPart)
], Reference.prototype, "allpart", void 0);
exports.Reference = Reference = __decorate([
    (0, typeorm_1.Entity)()
], Reference);
//# sourceMappingURL=reference.entity.js.map