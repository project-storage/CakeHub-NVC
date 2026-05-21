import { apiClient } from './client';
import { Cake, CakeDto } from '@/types/cake';

export const cakeService = {
  findAll: async (page = 1, limit = 10, search = "") => {
    const response = await apiClient.get('cakes', {
      searchParams: { page, limit, search }
    }).json<{
      success: boolean;
      data: Cake[];
      meta: { total: number; page: number; limit: number; totalPages: number }
    }>();
    return response;
  },
  findOne: async (id: number) => {
    const response = await apiClient.get(`cakes/${id}`).json<{ success: boolean; data: Cake }>();
    return response.data;
  },
  create: async (data: CakeDto) => {
    const response = await apiClient.post('cakes', { json: data }).json<{ success: boolean; data: Cake }>();
    return response.data;
  },
  update: async (id: number, data: Partial<CakeDto>) => {
    const response = await apiClient.patch(`cakes/${id}`, { json: data }).json<{ success: boolean; data: Cake }>();
    return response.data;
  },
  delete: async (id: number) => {
    await apiClient.delete(`cakes/${id}`);
  },
};
