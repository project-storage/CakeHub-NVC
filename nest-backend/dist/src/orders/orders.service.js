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
    async create(createOrderDto) {
        const { orderDetails, ...orderData } = createOrderDto;
        return this.prisma.$transaction(async (tx) => {
            const remainingAmount = orderData.totalPrice - (orderData.depositAmount || 0);
            const order = await tx.order.create({
                data: {
                    ...orderData,
                    remainingAmount,
                    status: remainingAmount === 0 ? client_1.OrderStatus.PAID : (orderData.depositAmount ? client_1.OrderStatus.DEPOSITED : client_1.OrderStatus.PENDING),
                    orderDetails: {
                        create: orderDetails.map(detail => ({
                            cakeId: detail.cakeId,
                            quantity: detail.quantity,
                            price: detail.price,
                        })),
                    },
                },
                include: {
                    orderDetails: true,
                },
            });
            for (const detail of orderDetails) {
                const cake = await tx.cake.findUnique({ where: { id: detail.cakeId } });
                if (!cake || cake.stock < detail.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for cake ID ${detail.cakeId}`);
                }
                await tx.cake.update({
                    where: { id: detail.cakeId },
                    data: { stock: cake.stock - detail.quantity },
                });
            }
            return order;
        });
    }
    async findAll(page = 1, limit = 10, status) {
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
            ...(status && { status }),
        };
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: { select: { firstName: true, lastName: true, email: true } },
                    student: { select: { fullName: true, studentCode: true } },
                    orderDetails: { include: { cake: { select: { cakeName: true } } } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const order = await this.prisma.order.findFirst({
            where: { id, deletedAt: null },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                student: { select: { fullName: true, studentCode: true } },
                orderDetails: { include: { cake: { select: { cakeName: true } } } },
                payments: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async update(id, updateOrderDto) {
        await this.findOne(id);
        return this.prisma.order.update({
            where: { id },
            data: updateOrderDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
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