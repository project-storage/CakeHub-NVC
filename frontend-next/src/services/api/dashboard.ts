import { apiClient } from './client';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalPendingPayment: number;
  totalCakesSold: number;
  topSellingCakes: {
    cakeId: number;
    cakeName: string;
    quantitySold: number;
  }[];
}

export const dashboardService = {
  getStatistics: async () => {
    const response = await apiClient.get('dashboard/statistics').json<{ success: boolean; data: DashboardStats }>();
    return response.data;
  },
};
