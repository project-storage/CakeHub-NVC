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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createDto) {
        const { orderDetails, ...orderData } = createDto;
        return this.prisma.order.create({
            data: {
                ...orderData,
                remainingAmount: orderData.totalPrice - (orderData.depositAmount || 0),
                status: orderData.depositAmount && orderData.depositAmount > 0
                    ? client_1.OrderStatus.DEPOSITED
                    : client_1.OrderStatus.PENDING,
                orderDetails: {
                    create: orderDetails,
                },
            },
            include: { orderDetails: true },
        });
    }
    async findAll(user, page = 1, limit = 10, status) {
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
            ...(status && { status }),
            ...(user.role === client_1.Role.ADVISOR && {
                student: { groupId: { in: groupIds } },
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                include: {
                    student: true,
                    orderDetails: { include: { cake: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.order.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id, user) {
        const order = await this.prisma.order.findFirst({
            where: { id, deletedAt: null },
            include: {
                student: { include: { group: true } },
                orderDetails: { include: { cake: true } },
                payments: true,
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (user.role === client_1.Role.ADVISOR) {
            if (!order.student?.groupId)
                throw new common_1.ForbiddenException('You do not have access to this order');
            const group = await this.prisma.group.findFirst({
                where: { id: order.student.groupId, advisorId: user.id },
            });
            if (!group)
                throw new common_1.ForbiddenException('You do not have access to this order');
        }
        return order;
    }
    async update(id, updateOrderDto, user) {
        await this.findOne(id, user);
        return this.prisma.order.update({
            where: { id },
            data: updateOrderDto,
        });
    }
    async remove(id, user) {
        await this.findOne(id, user);
        return this.prisma.order.update({
            where: { id },
            data: { deletedAt: new Date(), status: client_1.OrderStatus.CANCELLED },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map