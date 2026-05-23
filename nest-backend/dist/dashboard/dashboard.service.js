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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStatistics(user) {
        let groupIds = [];
        if (user.role === client_1.Role.ADVISOR) {
            const groups = await this.prisma.group.findMany({
                where: { advisorId: user.id },
                select: { id: true },
            });
            groupIds = groups.map((g) => g.id);
        }
        const orderWhere = {
            deletedAt: null,
            ...(user.role === client_1.Role.ADVISOR && {
                student: { groupId: { in: groupIds } },
            }),
        };
        const orderDetailWhere = {
            order: {
                deletedAt: null,
                status: { not: client_1.OrderStatus.CANCELLED },
                ...(user.role === client_1.Role.ADVISOR && {
                    student: { groupId: { in: groupIds } },
                }),
            },
        };
        const [totalOrders, revenueAgg, pendingPaymentAgg, cakesSold, topSellingCakes,] = await Promise.all([
            this.prisma.order.count({ where: orderWhere }),
            this.prisma.order.aggregate({
                _sum: { totalPrice: true },
                where: {
                    ...orderWhere,
                    status: { in: [client_1.OrderStatus.PAID, client_1.OrderStatus.DELIVERED] },
                },
            }),
            this.prisma.order.aggregate({
                _sum: { remainingAmount: true },
                where: orderWhere,
            }),
            this.prisma.orderDetail.aggregate({
                _sum: { quantity: true },
                where: orderDetailWhere,
            }),
            this.prisma.orderDetail.groupBy({
                by: ['cakeId'],
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5,
                where: orderDetailWhere,
            }),
        ]);
        const topCakesWithNames = await Promise.all(topSellingCakes.map(async (tc) => {
            const cake = await this.prisma.cake.findUnique({
                where: { id: tc.cakeId },
                select: { cakeName: true },
            });
            return {
                cakeId: tc.cakeId,
                cakeName: cake?.cakeName,
                quantitySold: tc._sum.quantity,
            };
        }));
        return {
            totalOrders,
            totalRevenue: revenueAgg._sum.totalPrice || 0,
            totalPendingPayment: pendingPaymentAgg._sum.remainingAmount || 0,
            totalCakesSold: cakesSold._sum.quantity || 0,
            topSellingCakes: topCakesWithNames,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map