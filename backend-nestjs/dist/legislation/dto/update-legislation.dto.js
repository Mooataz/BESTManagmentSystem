"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLegislationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_legislation_dto_1 = require("./create-legislation.dto");
class UpdateLegislationDto extends (0, swagger_1.PartialType)(create_legislation_dto_1.CreateLegislationDto) {
}
exports.UpdateLegislationDto = UpdateLegislationDto;
//# sourceMappingURL=update-legislation.dto.js.map