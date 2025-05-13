"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCoordinateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_coordinate_dto_1 = require("./create-coordinate.dto");
class UpdateCoordinateDto extends (0, swagger_1.PartialType)(create_coordinate_dto_1.CreateCoordinateDto) {
}
exports.UpdateCoordinateDto = UpdateCoordinateDto;
//# sourceMappingURL=update-coordinate.dto.js.map