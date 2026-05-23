"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDegreeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_degree_dto_1 = require("./create-degree.dto");
class UpdateDegreeDto extends (0, swagger_1.PartialType)(create_degree_dto_1.CreateDegreeDto) {
}
exports.UpdateDegreeDto = UpdateDegreeDto;
//# sourceMappingURL=update-degree.dto.js.map