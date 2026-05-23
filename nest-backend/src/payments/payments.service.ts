import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { OrderStatus, Role, Prisma } from "@prisma/client";
import { UserPayload } from "../common/types";

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: createPaymentDto.orderId },
      });

      if (!order || order.deletedAt) {
        throw new NotFoundException("Order not found");
      }

      if (order.status === OrderStatus.CANCELLED) {
        throw new BadRequestException("Cannot pay for cancelled order");
      }

      const payment = await tx.payment.create({
        data: createPaymentDto,
      });

      const remaining = Math.max(
        0,
        order.remainingAmount - createPaymentDto.amount,
      );
      const newStatus =
        remaining === 0 ? OrderStatus.PAID : OrderStatus.DEPOSITED;

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

  async findByOrder(orderId: number, user: UserPayload) {
    const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { student: true }
    });

    if (!order) throw new NotFoundException("Order not found");

    if (user.role === Role.ADVISOR) {
        if (!order.student?.groupId) throw new ForbiddenException("You do not have access to this order");
        const group = await this.prisma.group.findFirst({
            where: { id: order.student.groupId, advisorId: user.id }
        });
        if (!group) throw new ForbiddenException("You do not have access to this order");
    }

    return this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { paymentDate: "desc" },
    });
  }

  async findAll(user: UserPayload) {
    let groupIds: number[] = [];
    if (user.role === Role.ADVISOR) {
      const groups = await this.prisma.group.findMany({
        where: { advisorId: user.id },
        select: { id: true }
      });
      groupIds = groups.map(g => g.id);
    }

    const where: Prisma.PaymentWhereInput = {
      ...(user.role === Role.ADVISOR && {
        order: {
          student: { groupId: { in: groupIds } }
        }
      })
    };

    return this.prisma.payment.findMany({
      where,
      include: {
        order: { select: { id: true, status: true, totalPrice: true, student: true } },
      },
      orderBy: { paymentDate: "desc" },
    });
  }
}
