import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
import { UserPayload } from '../common/types';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<{
        orderDetails: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            price: number;
            cakeId: number;
            quantity: number;
            orderId: number;
        }[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        totalPrice: number;
        depositAmount: number;
        remainingAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        studentId: number | null;
        userId: number | null;
    }>;
    findAll(user: UserPayload, page?: string, limit?: string, status?: OrderStatus): Promise<{
        data: ({
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
            orderDetails: ({
                cake: {
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    id: number;
                    cakeName: string;
                    price: number;
                    pound: number;
                    stock: number;
                };
            } & {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                price: number;
                cakeId: number;
                quantity: number;
                orderId: number;
            })[];
        } & {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            totalPrice: number;
            depositAmount: number;
            remainingAmount: number;
            status: import("@prisma/client").$Enums.OrderStatus;
            studentId: number | null;
            userId: number | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        success: boolean;
    }>;
    findOne(id: number, user: UserPayload): Promise<{
        success: boolean;
        data: {
            student: ({
                group: {
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    id: number;
                    name: string;
                    degreeId: number | null;
                    departmentId: number | null;
                    advisorId: number | null;
                } | null;
            } & {
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                id: number;
                studentCode: string;
                fullName: string;
                citizenId: string | null;
                groupId: number | null;
            }) | null;
            orderDetails: ({
                cake: {
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    id: number;
                    cakeName: string;
                    price: number;
                    pound: number;
                    stock: number;
                };
            } & {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                price: number;
                cakeId: number;
                quantity: number;
                orderId: number;
            })[];
            payments: {
                type: import("@prisma/client").$Enums.PaymentType;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                orderId: number;
                amount: number;
                paymentDate: Date;
            }[];
        } & {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            totalPrice: number;
            depositAmount: number;
            remainingAmount: number;
            status: import("@prisma/client").$Enums.OrderStatus;
            studentId: number | null;
            userId: number | null;
        };
    }>;
    update(id: number, updateOrderDto: UpdateOrderDto, user: UserPayload): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            totalPrice: number;
            depositAmount: number;
            remainingAmount: number;
            status: import("@prisma/client").$Enums.OrderStatus;
            studentId: number | null;
            userId: number | null;
        };
    }>;
    remove(id: number, user: UserPayload): Promise<{
        success: boolean;
        message: string;
    }>;
}
