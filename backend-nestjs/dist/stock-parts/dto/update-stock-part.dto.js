"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStockPartDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_stock_part_dto_1 = require("./create-stock-part.dto");
class UpdateStockPartDto extends (0, swagger_1.PartialType)(create_stock_part_dto_1.CreateStockPartDto) {
}
exports.UpdateStockPartDto = UpdateStockPartDto;
//# sourceMappingURL=update-stock-part.dto.js.map