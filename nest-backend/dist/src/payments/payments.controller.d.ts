import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: CreatePaymentDto): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.PaymentType;
            orderId: number;
            amount: number;
            paymentDate: Date;
        };
    }>;
    findAll(): Promise<{
        success: boolean;
        data: ({
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
        })[];
    }>;
    findByOrder(orderId: number): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.PaymentType;
            orderId: number;
            amount: number;
            paymentDate: Date;
        }[];
    }>;
}
