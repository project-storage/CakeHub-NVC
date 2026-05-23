import { apiClient } from '@/lib/api-client';
import { Order, OrderDto } from '@/types/order';

export interface OrderListResponse {
  success: boolean;
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const orderService = {
  findAll: async (page = 1, limit = 10, search = ""): Promise<OrderListResponse> => {
    return apiClient.get('orders', {
      searchParams: { page, limit, search }
    }).json<OrderListResponse>();
  },

  findOne: async (id: number): Promise<Order> => {
    const response = await apiClient.get(`orders/${id}`).json<{ success: boolean; data: Order }>();
    return response.data;
  },

  create: async (data: OrderDto): Promise<Order> => {
    const response = await apiClient.post('orders', { json: data }).json<{ success: boolean; data: Order }>();
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<Order> => {
    const response = await apiClient.patch(`orders/${id}`, { json: { status } }).json<{ success: boolean; data: Order }>();
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`orders/${id}`);
  },
};
