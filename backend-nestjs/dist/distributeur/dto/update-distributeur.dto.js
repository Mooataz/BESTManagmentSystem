"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDistributeurDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_distributeur_dto_1 = require("./create-distributeur.dto");
class UpdateDistributeurDto extends (0, mapped_types_1.PartialType)(create_distributeur_dto_1.CreateDistributeurDto) {
}
exports.UpdateDistributeurDto = UpdateDistributeurDto;
//# sourceMappingURL=update-distributeur.dto.js.map