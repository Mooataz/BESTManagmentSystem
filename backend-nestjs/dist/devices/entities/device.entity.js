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
exports.Device = void 0;
const model_entity_1 = require("../../models/entities/model.entity");
const repair_entity_1 = require("../../repair/entities/repair.entity");
const typeorm_1 = require("typeorm");
let Device = class Device {
    id;
    serialenumber;
    purchaseDate;
    repair;
    model;
};
exports.Device = Device;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Device.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Device.prototype, "serialenumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Device.prototype, "purchaseDate", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => repair_entity_1.Repair, repair => repair.device),
    __metadata("design:type", Array)
], Device.prototype, "repair", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => model_entity_1.Model, model => model.device),
    __metadata("design:type", model_entity_1.Model)
], Device.prototype, "model", void 0);
exports.Device = Device = __decorate([
    (0, typeorm_1.Entity)()
], Device);
//# sourceMappingURL=device.entity.js.map