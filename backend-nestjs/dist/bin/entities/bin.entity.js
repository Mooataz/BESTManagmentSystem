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
exports.Bin = void 0;
const branch_entity_1 = require("../../branches/entities/branch.entity");
const stock_part_entity_1 = require("../../stock-parts/entities/stock-part.entity");
const typeorm_1 = require("typeorm");
let Bin = class Bin {
    id;
    name;
    type;
    branch;
    stockPart;
};
exports.Bin = Bin;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Bin.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Bin.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bin.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch, branch => branch.bin),
    __metadata("design:type", branch_entity_1.Branch)
], Bin.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_part_entity_1.StockPart, stockPart => stockPart.bin),
    __metadata("design:type", Array)
], Bin.prototype, "stockPart", void 0);
exports.Bin = Bin = __decorate([
    (0, typeorm_1.Entity)()
], Bin);
//# sourceMappingURL=bin.entity.js.map