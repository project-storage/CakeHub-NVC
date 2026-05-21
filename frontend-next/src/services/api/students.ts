import { apiClient } from './client';
import { Student, StudentDto } from '@/types/student';

export const studentService = {
  findAll: async (page = 1, limit = 10, search = "") => {
    const response = await apiClient.get('students', {
      searchParams: { page, limit, search }
    }).json<{
      success: boolean;
      data: Student[];
      meta: { total: number; page: number; limit: number; totalPages: number }
    }>();
    return response;
  },
  findOne: async (id: number) => {
    const response = await apiClient.get(`students/${id}`).json<{ success: boolean; data: Student }>();
    return response.data;
  },
  create: async (data: StudentDto) => {
    const response = await apiClient.post('students', { json: data }).json<{ success: boolean; data: Student }>();
    return response.data;
  },
  update: async (id: number, data: Partial<StudentDto>) => {
    const response = await apiClient.patch(`students/${id}`, { json: data }).json<{ success: boolean; data: Student }>();
    return response.data;
  },
  delete: async (id: number) => {
    await apiClient.delete(`students/${id}`);
  },
};
