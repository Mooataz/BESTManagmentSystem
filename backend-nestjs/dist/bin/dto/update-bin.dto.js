"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBinDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_bin_dto_1 = require("./create-bin.dto");
class UpdateBinDto extends (0, swagger_1.PartialType)(create_bin_dto_1.CreateBinDto) {
}
exports.UpdateBinDto = UpdateBinDto;
//# sourceMappingURL=update-bin.dto.js.map