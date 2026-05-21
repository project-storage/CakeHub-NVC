import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStatistics(): Promise<{
        success: boolean;
        data: {
            totalOrders: number;
            totalRevenue: number;
            totalPendingPayment: number;
            totalCakesSold: number;
            topSellingCakes: {
                cakeId: number;
                cakeName: string | undefined;
                quantitySold: number | null;
            }[];
        };
    }>;
}
