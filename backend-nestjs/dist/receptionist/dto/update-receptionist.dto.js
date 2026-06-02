"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReceptionistDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_receptionist_dto_1 = require("./create-receptionist.dto");
class UpdateReceptionistDto extends (0, swagger_1.PartialType)(create_receptionist_dto_1.CreateReceptionistDto) {
}
exports.UpdateReceptionistDto = UpdateReceptionistDto;
//# sourceMappingURL=update-receptionist.dto.js.map