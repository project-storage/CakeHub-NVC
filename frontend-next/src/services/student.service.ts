import { apiClient } from '@/lib/api-client';
import { Student, StudentDto } from '@/types/student';

export interface StudentListResponse {
  success: boolean;
  data: Student[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const studentService = {
  findAll: async (page = 1, limit = 10, search = ""): Promise<StudentListResponse> => {
    return apiClient.get('students', {
      searchParams: { page, limit, search }
    }).json<StudentListResponse>();
  },

  findOne: async (id: number): Promise<Student> => {
    const response = await apiClient.get(`students/${id}`).json<{ success: boolean; data: Student }>();
    return response.data;
  },

  create: async (data: StudentDto): Promise<Student> => {
    const response = await apiClient.post('students', { json: data }).json<{ success: boolean; data: Student }>();
    return response.data;
  },

  update: async (id: number, data: Partial<StudentDto>): Promise<Student> => {
    const response = await apiClient.patch(`students/${id}`, { json: data }).json<{ success: boolean; data: Student }>();
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`students/${id}`);
  },
};
