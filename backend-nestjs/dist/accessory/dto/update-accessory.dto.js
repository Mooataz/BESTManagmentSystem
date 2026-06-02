"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAccessoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_accessory_dto_1 = require("./create-accessory.dto");
class UpdateAccessoryDto extends (0, swagger_1.PartialType)(create_accessory_dto_1.CreateAccessoryDto) {
}
exports.UpdateAccessoryDto = UpdateAccessoryDto;
//# sourceMappingURL=update-accessory.dto.js.map