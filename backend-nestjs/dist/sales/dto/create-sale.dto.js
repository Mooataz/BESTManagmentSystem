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
exports.CreateSaleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateSaleDto {
    state;
    totalPrice;
    date;
}
exports.CreateSaleDto = CreateSaleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: "Required"
    }),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        format: ('Float'),
        description: "Required"
    }),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Date,
        description: "Required"
    }),
    __metadata("design:type", Date)
], CreateSaleDto.prototype, "date", void 0);
//# sourceMappingURL=create-sale.dto.js.map