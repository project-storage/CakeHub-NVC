import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStatistics() {
    const [
      totalOrders,
      revenueAgg,
      pendingPaymentAgg,
      cakesSold,
      topSellingCakes,
    ] = await Promise.all([
      // Total Orders
      this.prisma.order.count({ where: { deletedAt: null } }),

      // Total Revenue (PAID or DELIVERED orders)
      this.prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: {
          status: { in: [OrderStatus.PAID, OrderStatus.DELIVERED] },
          deletedAt: null,
        },
      }),

      // Pending Payment
      this.prisma.order.aggregate({
        _sum: { remainingAmount: true },
        where: { deletedAt: null },
      }),

      // Total Cakes Sold
      this.prisma.orderDetail.aggregate({
        _sum: { quantity: true },
        where: {
          order: { deletedAt: null, status: { not: OrderStatus.CANCELLED } },
        },
      }),

      // Top Selling Cake
      this.prisma.orderDetail.groupBy({
        by: ['cakeId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
        where: {
          order: { deletedAt: null, status: { not: OrderStatus.CANCELLED } },
        },
      }),
    ]);

    // Fetch cake names for top selling
    const topCakesWithNames = await Promise.all(
      topSellingCakes.map(async (tc) => {
        const cake = await this.prisma.cake.findUnique({
          where: { id: tc.cakeId },
          select: { cakeName: true },
        });
        return {
          cakeId: tc.cakeId,
          cakeName: cake?.cakeName,
          quantitySold: tc._sum.quantity,
        };
      }),
    );

    return {
      totalOrders,
      totalRevenue: revenueAgg._sum.totalPrice || 0,
      totalPendingPayment: pendingPaymentAgg._sum.remainingAmount || 0,
      totalCakesSold: cakesSold._sum.quantity || 0,
      topSellingCakes: topCakesWithNames,
    };
  }
}
