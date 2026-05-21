import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: createPaymentDto.orderId },
      });

      if (!order || order.deletedAt) {
        throw new NotFoundException('Order not found');
      }

      if (order.status === OrderStatus.CANCELLED) {
        throw new BadRequestException('Cannot pay for cancelled order');
      }

      const payment = await tx.payment.create({
        data: createPaymentDto,
      });

      const remaining = Math.max(0, order.remainingAmount - createPaymentDto.amount);
      const newStatus = remaining === 0 ? OrderStatus.PAID : OrderStatus.DEPOSITED;

      await tx.order.update({
        where: { id: order.id },
        data: {
          remainingAmount: remaining,
          status: newStatus,
        },
      });

      return payment;
    });
  }

  async findByOrder(orderId: number) {
    return this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { paymentDate: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.payment.findMany({
      include: {
        order: { select: { id: true, status: true, totalPrice: true } },
      },
      orderBy: { paymentDate: 'desc' },
    });
  }
}
