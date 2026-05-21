import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStatistics(): Promise<{
        totalOrders: number;
        totalRevenue: number;
        totalPendingPayment: number;
        totalCakesSold: number;
        topSellingCakes: {
            cakeId: number;
            cakeName: string | undefined;
            quantitySold: number | null;
        }[];
    }>;
}
