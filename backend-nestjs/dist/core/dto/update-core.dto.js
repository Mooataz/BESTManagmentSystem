"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCoreDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_core_dto_1 = require("./create-core.dto");
class UpdateCoreDto extends (0, swagger_1.PartialType)(create_core_dto_1.CreateCoreDto) {
}
exports.UpdateCoreDto = UpdateCoreDto;
//# sourceMappingURL=update-core.dto.js.map