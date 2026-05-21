import { PrismaService } from '../prisma/prisma.service';
import { Response } from 'express';
export declare class ReportService {
    private prisma;
    constructor(prisma: PrismaService);
    getOrderSummary(res?: Response, exportType?: string): Promise<({
        orderDetails: ({
            cake: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                cakeName: string;
                price: number;
                pound: number;
                stock: number;
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
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            studentCode: string;
            fullName: string;
            citizenId: string | null;
            groupId: number | null;
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
    })[] | undefined>;
    getRevenueSummary(res?: Response, exportType?: string): Promise<({
        order: {
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
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.PaymentType;
        orderId: number;
        amount: number;
        paymentDate: Date;
    })[] | undefined>;
    getTotalCakeReport(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        cakeName: string;
        price: number;
        pound: number;
        stock: number;
    }[]>;
    getDepartmentReport(): Promise<({
        groups: ({
            students: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                studentCode: string;
                fullName: string;
                citizenId: string | null;
                groupId: number | null;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            advisor: string | null;
            degreeId: number | null;
            departmentId: number | null;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        departmentName: string;
    })[]>;
    getStudentOrderReport(): Promise<({
        orders: ({
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
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        studentCode: string;
        fullName: string;
        citizenId: string | null;
        groupId: number | null;
    })[]>;
}
