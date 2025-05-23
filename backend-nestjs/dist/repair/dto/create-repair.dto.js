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
    warrenty;
    approveRepair;
    files;
    newSerialNumber;
    advancePayment;
    actuellyBranch;
    partsNeed;
    remark;
    deviceStateReceive;
    accessoryIds;
    listFaultIds;
    customerRequestIds;
    notesCustomerIds;
    expertiseReasonsIds;
    repairActionIds;
    device;
    user;
    customer;
}
exports.CreateRepairDto = CreateRepairDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: "Required" }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRepairDto.prototype, "warrenty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean, description: "Required" }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRepairDto.prototype, "approveRepair", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: "Required" }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateRepairDto.prototype, "files", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", String)
], CreateRepairDto.prototype, "newSerialNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: "Required" }),
    __metadata("design:type", Number)
], CreateRepairDto.prototype, "advancePayment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: "Required" }),
    __metadata("design:type", Number)
], CreateRepairDto.prototype, "actuellyBranch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], description: "Required" }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreateRepairDto.prototype, "partsNeed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: "Required" }),
    __metadata("design:type", String)
], CreateRepairDto.prototype, "remark", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: "Required" }),
    __metadata("design:type", String)
], CreateRepairDto.prototype, "deviceStateReceive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Array, description: "Required" }),
    __metadata("design:type", Array)
], CreateRepairDto.prototype, "accessoryIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Array, description: "Required" }),
    __metadata("design:type", Array)
], CreateRepairDto.prototype, "listFaultIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Array, description: "Required" }),
    __metadata("design:type", Array)
], CreateRepairDto.prototype, "customerRequestIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Array, description: "Required" }),
    __metadata("design:type", Array)
], CreateRepairDto.prototype, "notesCustomerIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Array, description: "Required" }),
    __metadata("design:type", Array)
], CreateRepairDto.prototype, "expertiseReasonsIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Array, description: "Required" }),
    __metadata("design:type", Array)
], CreateRepairDto.prototype, "repairActionIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, }),
    __metadata("design:type", Number)
], CreateRepairDto.prototype, "device", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, }),
    __metadata("design:type", Number)
], CreateRepairDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, }),
    __metadata("design:type", Number)
], CreateRepairDto.prototype, "customer", void 0);
//# sourceMappingURL=create-repair.dto.js.map