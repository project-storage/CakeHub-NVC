import { apiClient } from './client';

export interface Group {
  id: number;
  name: string;
  advisor?: string;
  createdAt: string;
  updatedAt: string;
}

export const groupService = {
  findAll: async () => {
    const response = await apiClient.get('groups').json<{
      success: boolean;
      data: Group[];
    }>();
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post('groups', { json: data }).json<{ success: boolean; data: Group }>();
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await apiClient.patch(`groups/${id}`, { json: data }).json<{ success: boolean; data: Group }>();
    return response.data;
  },
  delete: async (id: number) => {
    await apiClient.delete(`groups/${id}`);
  },
};
