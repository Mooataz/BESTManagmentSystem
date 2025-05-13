"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomerRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_customer_request_dto_1 = require("./create-customer-request.dto");
class UpdateCustomerRequestDto extends (0, swagger_1.PartialType)(create_customer_request_dto_1.CreateCustomerRequestDto) {
}
exports.UpdateCustomerRequestDto = UpdateCustomerRequestDto;
//# sourceMappingURL=update-customer-request.dto.js.map