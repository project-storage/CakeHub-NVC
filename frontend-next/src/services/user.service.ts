import { apiClient } from '@/lib/api-client';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

export interface UserListResponse {
  success: boolean;
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const userService = {
  findAll: async (page = 1, limit = 10, search = ""): Promise<UserListResponse> => {
    return apiClient.get('users', {
      searchParams: { page, limit, search }
    }).json<UserListResponse>();
  },

  update: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch(`users/${id}`, { json: data }).json<{ success: boolean; data: User }>();
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`users/${id}`);
  },
};
