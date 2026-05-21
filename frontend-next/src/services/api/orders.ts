import { apiClient } from './client';
import { Order, OrderDto } from '@/types/order';

export const orderService = {
  findAll: async (page = 1, limit = 10, search = "") => {
    const response = await apiClient.get('orders', {
      searchParams: { page, limit, search }
    }).json<{
      success: boolean;
      data: Order[];
      meta: { total: number; page: number; limit: number; totalPages: number }
    }>();
    return response;
  },
  findOne: async (id: number) => {
    const response = await apiClient.get(`orders/${id}`).json<{ success: boolean; data: Order }>();
    return response.data;
  },
  create: async (data: OrderDto) => {
    const response = await apiClient.post('orders', { json: data }).json<{ success: boolean; data: Order }>();
    return response.data;
  },
  updateStatus: async (id: number, status: string) => {
    const response = await apiClient.patch(`orders/${id}`, { json: { status } }).json<{ success: boolean; data: Order }>();
    return response.data;
  },
  delete: async (id: number) => {
    await apiClient.delete(`orders/${id}`);
  },
};
