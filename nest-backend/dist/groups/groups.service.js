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
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let GroupsService = class GroupsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto) {
        const { advisorId, degreeId, departmentId, ...rest } = createDto;
        return this.prisma.group.create({
            data: {
                ...rest,
                advisorId,
                degreeId,
                departmentId,
            },
        });
    }
    async findAll(user, page = 1, limit = 10, search) {
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
            ...(user.role === client_1.Role.ADVISOR && { advisorId: user.id }),
            ...(search && {
                name: { contains: search, mode: 'insensitive' },
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.group.findMany({
                where,
                skip,
                take: limit,
                include: { degree: true, department: true, advisor: true },
            }),
            this.prisma.group.count({ where }),
        ]);
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id, user) {
        const record = await this.prisma.group.findFirst({
            where: { id, deletedAt: null },
            include: { degree: true, department: true, advisor: true },
        });
        if (!record)
            throw new common_1.NotFoundException('Group not found');
        if (user.role === client_1.Role.ADVISOR && record.advisorId !== user.id) {
            throw new common_1.ForbiddenException('You do not have access to this group');
        }
        return record;
    }
    async update(id, updateDto, user) {
        await this.findOne(id, user);
        const { advisorId, degreeId, departmentId, ...rest } = updateDto;
        return this.prisma.group.update({
            where: { id },
            data: {
                ...rest,
                advisorId,
                degreeId,
                departmentId,
            },
        });
    }
    async remove(id, user) {
        await this.findOne(id, user);
        return this.prisma.group.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GroupsService);
//# sourceMappingURL=groups.service.js.map