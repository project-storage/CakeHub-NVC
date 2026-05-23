import { ReportService } from './report.service';
import type { Response } from 'express';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    getOrderSummary(exportType: string, res: Response): Promise<({
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
    })[] | undefined>;
    getRevenueSummary(exportType: string, res: Response): Promise<({
        order: {
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
    } & {
        type: import("@prisma/client").$Enums.PaymentType;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        orderId: number;
        amount: number;
        paymentDate: Date;
    })[] | undefined>;
    getTotalCakeReport(): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            cakeName: string;
            price: number;
            pound: number;
            stock: number;
        }[];
    }>;
    getDepartmentReport(): Promise<{
        success: boolean;
        data: ({
            groups: ({
                students: {
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    id: number;
                    studentCode: string;
                    fullName: string;
                    citizenId: string | null;
                    groupId: number | null;
                }[];
            } & {
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                id: number;
                name: string;
                degreeId: number | null;
                departmentId: number | null;
                advisorId: number | null;
            })[];
        } & {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            departmentName: string;
        })[];
    }>;
    getStudentOrderReport(): Promise<{
        success: boolean;
        data: ({
            orders: ({
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
            })[];
        } & {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            studentCode: string;
            fullName: string;
            citizenId: string | null;
            groupId: number | null;
        })[];
    }>;
}
