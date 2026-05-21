import { apiClient } from './client';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

export const userService = {
  findAll: async (page = 1, limit = 10, search = "") => {
    const response = await apiClient.get('users', {
      searchParams: { page, limit, search }
    }).json<{
      success: boolean;
      data: User[];
      meta: { total: number; page: number; limit: number; totalPages: number }
    }>();
    return response;
  },
  update: async (id: number, data: any) => {
    const response = await apiClient.patch(`users/${id}`, { json: data }).json<{ success: boolean; data: User }>();
    return response.data;
  },
  delete: async (id: number) => {
    await apiClient.delete(`users/${id}`);
  },
};
