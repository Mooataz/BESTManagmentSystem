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
exports.CreatePartsPriceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePartsPriceDto {
    price;
    modelId;
    allPartId;
    laborCharge;
}
exports.CreatePartsPriceDto = CreatePartsPriceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: "Required"
    }),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePartsPriceDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'ID of the associated model' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePartsPriceDto.prototype, "modelId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'ID of the associated allPart' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePartsPriceDto.prototype, "allPartId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: "Required"
    }),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePartsPriceDto.prototype, "laborCharge", void 0);
//# sourceMappingURL=create-parts-price.dto.js.map