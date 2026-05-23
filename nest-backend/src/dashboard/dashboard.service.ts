import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OrderStatus, Role, Prisma } from "@prisma/client";
import { UserPayload } from "../common/types";

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStatistics(user: UserPayload) {
    let groupIds: number[] = [];
    if (user.role === Role.ADVISOR) {
      const groups = await this.prisma.group.findMany({
        where: { advisorId: user.id },
        select: { id: true }
      });
      groupIds = groups.map(g => g.id);
    }

    const orderWhere: Prisma.OrderWhereInput = {
      deletedAt: null,
      ...(user.role === Role.ADVISOR && {
        student: { groupId: { in: groupIds } }
      })
    };

    const orderDetailWhere: Prisma.OrderDetailWhereInput = {
      order: {
        deletedAt: null,
        status: { not: OrderStatus.CANCELLED },
        ...(user.role === Role.ADVISOR && {
          student: { groupId: { in: groupIds } }
        })
      }
    };

    const [
      totalOrders,
      revenueAgg,
      pendingPaymentAgg,
      cakesSold,
      topSellingCakes,
    ] = await Promise.all([
      // Total Orders
      this.prisma.order.count({ where: orderWhere }),

      // Total Revenue (PAID or DELIVERED orders)
      this.prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: {
          ...orderWhere,
          status: { in: [OrderStatus.PAID, OrderStatus.DELIVERED] },
        },
      }),

      // Pending Payment
      this.prisma.order.aggregate({
        _sum: { remainingAmount: true },
        where: orderWhere,
      }),

      // Total Cakes Sold
      this.prisma.orderDetail.aggregate({
        _sum: { quantity: true },
        where: orderDetailWhere,
      }),

      // Top Selling Cake
      this.prisma.orderDetail.groupBy({
        by: ["cakeId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
        where: orderDetailWhere,
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
