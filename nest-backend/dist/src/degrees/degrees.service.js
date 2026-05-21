"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DegreesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DegreesService = class DegreesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto) {
        return this.prisma.degree.create({ data: createDto });
    }
    async findAll(page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
            ...(search && {
                OR: [
                    { degreeName: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.degree.findMany({ where, skip, take: limit }),
            this.prisma.degree.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const record = await this.prisma.degree.findFirst({ where: { id, deletedAt: null } });
        if (!record)
            throw new common_1.NotFoundException('Degree not found');
        return record;
    }
    async update(id, updateDto) {
        await this.findOne(id);
        return this.prisma.degree.update({ where: { id }, data: updateDto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.degree.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.DegreesService = DegreesService;
exports.DegreesService = DegreesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DegreesService);
//# sourceMappingURL=degrees.service.js.map