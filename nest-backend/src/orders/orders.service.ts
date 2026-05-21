import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { Prisma, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { orderDetails, ...orderData } = createOrderDto;

    // Use Prisma Transaction
    return this.prisma.$transaction(async (tx) => {
      // Create the order
      const remainingAmount = orderData.totalPrice - (orderData.depositAmount || 0);
      
      const order = await tx.order.create({
        data: {
          ...orderData,
          remainingAmount,
          status: remainingAmount === 0 ? OrderStatus.PAID : (orderData.depositAmount ? OrderStatus.DEPOSITED : OrderStatus.PENDING),
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

      // Update Cake stock
      for (const detail of orderDetails) {
        const cake = await tx.cake.findUnique({ where: { id: detail.cakeId } });
        if (!cake || cake.stock < detail.quantity) {
          throw new BadRequestException(`Insufficient stock for cake ID ${detail.cakeId}`);
        }
        await tx.cake.update({
          where: { id: detail.cakeId },
          data: { stock: cake.stock - detail.quantity },
        });
      }

      return order;
    });
  }

  async findAll(page: number = 1, limit: number = 10, status?: OrderStatus) {
    const skip = (page - 1) * limit;
    const where: Prisma.OrderWhereInput = {
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

  async findOne(id: number) {
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
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: { deletedAt: new Date(), status: OrderStatus.CANCELLED },
    });
  }
}
