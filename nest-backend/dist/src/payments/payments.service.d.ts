import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPaymentDto: CreatePaymentDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.PaymentType;
        orderId: number;
        amount: number;
        paymentDate: Date;
    }>;
    findByOrder(orderId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.PaymentType;
        orderId: number;
        amount: number;
        paymentDate: Date;
    }[]>;
    findAll(): Promise<({
        order: {
            id: number;
            totalPrice: number;
            status: import("@prisma/client").$Enums.OrderStatus;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.PaymentType;
        orderId: number;
        amount: number;
        paymentDate: Date;
    })[]>;
}
