import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UserPayload } from '../common/types';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: CreatePaymentDto): Promise<{
        success: boolean;
        data: {
            type: import("@prisma/client").$Enums.PaymentType;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            orderId: number;
            amount: number;
            paymentDate: Date;
        };
    }>;
    findAll(user: UserPayload): Promise<{
        success: boolean;
        data: ({
            order: {
                student: {
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    id: number;
                    studentCode: string;
                    fullName: string;
                    citizenId: string | null;
                    groupId: number | null;
                } | null;
                id: number;
                totalPrice: number;
                status: import("@prisma/client").$Enums.OrderStatus;
            };
        } & {
            type: import("@prisma/client").$Enums.PaymentType;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            orderId: number;
            amount: number;
            paymentDate: Date;
        })[];
    }>;
    findByOrder(orderId: number, user: UserPayload): Promise<{
        success: boolean;
        data: {
            type: import("@prisma/client").$Enums.PaymentType;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            orderId: number;
            amount: number;
            paymentDate: Date;
        }[];
    }>;
}
