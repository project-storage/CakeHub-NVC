"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCakeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_cake_dto_1 = require("./create-cake.dto");
class UpdateCakeDto extends (0, swagger_1.PartialType)(create_cake_dto_1.CreateCakeDto) {
}
exports.UpdateCakeDto = UpdateCakeDto;
//# sourceMappingURL=update-cake.dto.js.map