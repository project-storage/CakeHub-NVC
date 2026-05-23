import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { Prisma, Role, OrderStatus } from '@prisma/client';
import { UserPayload } from '../common/types';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateOrderDto) {
    const { orderDetails, ...orderData } = createDto;

    return this.prisma.order.create({
      data: {
        ...orderData,
        remainingAmount: orderData.totalPrice - (orderData.depositAmount || 0),
        status:
          orderData.depositAmount && orderData.depositAmount > 0
            ? OrderStatus.DEPOSITED
            : OrderStatus.PENDING,
        orderDetails: {
          create: orderDetails,
        },
      },
      include: { orderDetails: true },
    });
  }

  async findAll(
    user: UserPayload,
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus,
  ) {
    const skip = (page - 1) * limit;

    let groupIds: number[] = [];
    if (user.role === Role.ADVISOR) {
      const groups = await this.prisma.group.findMany({
        where: { advisorId: user.id },
        select: { id: true },
      });
      groupIds = groups.map((g) => g.id);
    }

    const where: Prisma.OrderWhereInput = {
      deletedAt: null,
      ...(status && { status }),
      ...(user.role === Role.ADVISOR && {
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

  async findOne(id: number, user: UserPayload) {
    const order = await this.prisma.order.findFirst({
      where: { id, deletedAt: null },
      include: {
        student: { include: { group: true } },
        orderDetails: { include: { cake: true } },
        payments: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (user.role === Role.ADVISOR) {
      if (!order.student?.groupId)
        throw new ForbiddenException('You do not have access to this order');
      const group = await this.prisma.group.findFirst({
        where: { id: order.student.groupId, advisorId: user.id },
      });
      if (!group)
        throw new ForbiddenException('You do not have access to this order');
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto, user: UserPayload) {
    await this.findOne(id, user);
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  async remove(id: number, user: UserPayload) {
    await this.findOne(id, user);
    return this.prisma.order.update({
      where: { id },
      data: { deletedAt: new Date(), status: OrderStatus.CANCELLED },
    });
  }
}
