"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateModelDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_model_dto_1 = require("./create-model.dto");
class UpdateModelDto extends (0, swagger_1.PartialType)(create_model_dto_1.CreateModelDto) {
}
exports.UpdateModelDto = UpdateModelDto;
//# sourceMappingURL=update-model.dto.js.map