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
exports.CreateCompanyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCompanyDto {
    name;
    headquarterslocation;
    taxRegisterNumber;
    rib;
    logo;
    bank;
    quantityAlertStock;
}
exports.CreateCompanyDto = CreateCompanyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Required"
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmpty)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Required"
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmpty)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "headquarterslocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Required"
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmpty)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "taxRegisterNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: "Required"
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsEmpty)(),
    __metadata("design:type", Number)
], CreateCompanyDto.prototype, "rib", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Required"
    }),
    (0, class_validator_1.IsEmpty)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Required"
    }),
    (0, class_validator_1.IsEmpty)(),
    __metadata("design:type", String)
], CreateCompanyDto.prototype, "bank", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: "Required"
    }),
    __metadata("design:type", Number)
], CreateCompanyDto.prototype, "quantityAlertStock", void 0);
//# sourceMappingURL=create-company.dto.js.map