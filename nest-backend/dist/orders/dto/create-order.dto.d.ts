import { OrderStatus } from '@prisma/client';
export declare class OrderDetailDto {
    cakeId: number;
    quantity: number;
    price: number;
}
export declare class CreateOrderDto {
    userId?: number;
    studentId?: number;
    totalPrice: number;
    depositAmount?: number;
    orderDetails: OrderDetailDto[];
}
export declare class UpdateOrderDto {
    status?: OrderStatus;
}
