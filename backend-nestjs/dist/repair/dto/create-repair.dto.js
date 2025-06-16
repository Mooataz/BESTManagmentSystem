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
exports.CreateRepairDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRepairDto {
    actuellybranch;
    customer;
    device;
    remark;
    deviceStateReceive;
    accessoryIds;
    listFaultIds;
    customerRequestIds;
}
exports.CreateRepairDto = CreateRepairDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateRepairDto.prototype, "actuellybranch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateRepairDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateRepairDto.prototype, "device", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRepairDto.prototype, "remark", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], CreateRepairDto.prototype, "deviceStateReceive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateRepairDto.prototype, "accessoryIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], required: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreateRepairDto.prototype, "listFaultIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Array }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateRepairDto.prototype, "customerRequestIds", void 0);
//# sourceMappingURL=create-repair.dto.js.map