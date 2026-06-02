"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTechnicienDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_technicien_dto_1 = require("./create-technicien.dto");
class UpdateTechnicienDto extends (0, swagger_1.PartialType)(create_technicien_dto_1.CreateTechnicienDto) {
}
exports.UpdateTechnicienDto = UpdateTechnicienDto;
//# sourceMappingURL=update-technicien.dto.js.map