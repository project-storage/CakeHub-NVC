import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<{
        orderDetails: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            cakeId: number;
            quantity: number;
            orderId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: number | null;
        studentId: number | null;
        totalPrice: number;
        depositAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        remainingAmount: number;
    }>;
    findAll(page?: string, limit?: string, status?: OrderStatus): Promise<{
        data: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
            } | null;
            orderDetails: ({
                cake: {
                    cakeName: string;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                cakeId: number;
                quantity: number;
                orderId: number;
            })[];
            student: {
                studentCode: string;
                fullName: string;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: number | null;
            studentId: number | null;
            totalPrice: number;
            depositAmount: number;
            status: import("@prisma/client").$Enums.OrderStatus;
            remainingAmount: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        success: boolean;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: {
            user: {
                email: string;
                firstName: string;
                lastName: string;
            } | null;
            orderDetails: ({
                cake: {
                    cakeName: string;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                cakeId: number;
                quantity: number;
                orderId: number;
            })[];
            student: {
                studentCode: string;
                fullName: string;
            } | null;
            payments: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.PaymentType;
                orderId: number;
                amount: number;
                paymentDate: Date;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: number | null;
            studentId: number | null;
            totalPrice: number;
            depositAmount: number;
            status: import("@prisma/client").$Enums.OrderStatus;
            remainingAmount: number;
        };
    }>;
    update(id: number, updateOrderDto: UpdateOrderDto): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: number | null;
            studentId: number | null;
            totalPrice: number;
            depositAmount: number;
            status: import("@prisma/client").$Enums.OrderStatus;
            remainingAmount: number;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
