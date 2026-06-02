"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTracabilityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_tracability_dto_1 = require("./create-tracability.dto");
class UpdateTracabilityDto extends (0, swagger_1.PartialType)(create_tracability_dto_1.CreateTracabilityDto) {
}
exports.UpdateTracabilityDto = UpdateTracabilityDto;
//# sourceMappingURL=update-tracability.dto.js.map