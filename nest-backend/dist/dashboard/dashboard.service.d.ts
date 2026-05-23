import { PrismaService } from '../prisma/prisma.service';
import { UserPayload } from '../common/types';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getStatistics(user: UserPayload): Promise<{
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
