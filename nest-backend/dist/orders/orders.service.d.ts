import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
import { UserPayload } from '../common/types';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateOrderDto): Promise<{
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
    findAll(user: UserPayload, page?: number, limit?: number, status?: OrderStatus): Promise<{
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
    }>;
    findOne(id: number, user: UserPayload): Promise<{
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
    }>;
    update(id: number, updateOrderDto: UpdateOrderDto, user: UserPayload): Promise<{
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
    remove(id: number, user: UserPayload): Promise<{
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
}
