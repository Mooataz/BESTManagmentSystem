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
exports.TypeModel = void 0;
const model_entity_1 = require("../../models/entities/model.entity");
const typeorm_1 = require("typeorm");
let TypeModel = class TypeModel {
    id;
    description;
    model;
};
exports.TypeModel = TypeModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TypeModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TypeModel.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => model_entity_1.Model, Model => Model.typeModel),
    __metadata("design:type", Array)
], TypeModel.prototype, "model", void 0);
exports.TypeModel = TypeModel = __decorate([
    (0, typeorm_1.Entity)()
], TypeModel);
//# sourceMappingURL=type-model.entity.js.map