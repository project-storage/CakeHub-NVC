import { apiClient } from '@/lib/api-client';

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  paymentDate: string;
  type: 'DEPOSIT' | 'FULL_PAYMENT';
  order?: {
    id: number;
    status: string;
    totalPrice: number;
  };
}

export const paymentService = {
  findAll: async (): Promise<Payment[]> => {
    const response = await apiClient.get('payments').json<{ success: boolean; data: Payment[] }>();
    return response.data;
  },

  create: async (data: { orderId: number; amount: number; type: string }): Promise<Payment> => {
    const response = await apiClient.post('payments', { json: data }).json<{ success: boolean; data: Payment }>();
    return response.data;
  },
};
