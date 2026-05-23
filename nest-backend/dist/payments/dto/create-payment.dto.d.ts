import { PaymentType } from '@prisma/client';
export declare class CreatePaymentDto {
    orderId: number;
    amount: number;
    type: PaymentType;
}
