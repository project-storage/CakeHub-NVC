import { apiClient } from '@/lib/api-client';
import { Cake, CakeDto } from '@/types/cake';

export interface CakeListResponse {
  success: boolean;
  data: Cake[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const cakeService = {
  findAll: async (page = 1, limit = 10, search = ""): Promise<CakeListResponse> => {
    return apiClient.get('cakes', {
      searchParams: { page, limit, search }
    }).json<CakeListResponse>();
  },

  findOne: async (id: number): Promise<Cake> => {
    const response = await apiClient.get(`cakes/${id}`).json<{ success: boolean; data: Cake }>();
    return response.data;
  },

  create: async (data: CakeDto): Promise<Cake> => {
    const response = await apiClient.post('cakes', { json: data }).json<{ success: boolean; data: Cake }>();
    return response.data;
  },

  update: async (id: number, data: Partial<CakeDto>): Promise<Cake> => {
    const response = await apiClient.patch(`cakes/${id}`, { json: data }).json<{ success: boolean; data: Cake }>();
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`cakes/${id}`);
  },
};
