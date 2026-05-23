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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto, user) {
        if (user.role === client_1.Role.ADVISOR) {
            if (!createDto.groupId) {
                throw new common_1.BadRequestException('Group ID is required for advisors');
            }
            const group = await this.prisma.group.findFirst({
                where: { id: createDto.groupId, advisorId: user.id },
            });
            if (!group) {
                throw new common_1.ForbiddenException('You do not have access to this group');
            }
        }
        return this.prisma.student.create({ data: createDto });
    }
    async findAll(user, page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        let groupIds = [];
        if (user.role === client_1.Role.ADVISOR) {
            const groups = await this.prisma.group.findMany({
                where: { advisorId: user.id },
                select: { id: true },
            });
            groupIds = groups.map((g) => g.id);
        }
        const where = {
            deletedAt: null,
            ...(user.role === client_1.Role.ADVISOR && { groupId: { in: groupIds } }),
            ...(search && {
                OR: [
                    { studentCode: { contains: search, mode: 'insensitive' } },
                    { fullName: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.student.findMany({
                where,
                skip,
                take: limit,
                include: { group: true },
            }),
            this.prisma.student.count({ where }),
        ]);
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id, user) {
        const record = await this.prisma.student.findFirst({
            where: { id, deletedAt: null },
            include: { group: true },
        });
        if (!record)
            throw new common_1.NotFoundException('Student not found');
        if (user.role === client_1.Role.ADVISOR) {
            if (!record.groupId)
                throw new common_1.ForbiddenException('You do not have access to this student');
            const group = await this.prisma.group.findFirst({
                where: { id: record.groupId, advisorId: user.id },
            });
            if (!group)
                throw new common_1.ForbiddenException('You do not have access to this student');
        }
        return record;
    }
    async update(id, updateDto, user) {
        await this.findOne(id, user);
        if (user.role === client_1.Role.ADVISOR && updateDto.groupId) {
            const group = await this.prisma.group.findFirst({
                where: { id: updateDto.groupId, advisorId: user.id },
            });
            if (!group) {
                throw new common_1.ForbiddenException('You do not have access to this group');
            }
        }
        return this.prisma.student.update({ where: { id }, data: updateDto });
    }
    async remove(id, user) {
        await this.findOne(id, user);
        return this.prisma.student.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map