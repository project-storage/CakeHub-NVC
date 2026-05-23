import { apiClient } from './client';
import { LoginDto } from '@/types/auth';

export const authService = {
  login: async (data: LoginDto) => {
    const response = await apiClient.post('auth/login', { json: data }).json<{
      success: boolean;
      data: {
        user: any;
        accessToken: string;
        refreshToken: string;
      }
    }>();
    return response.data;
  },
  register: async (data: any) => {
    const response = await apiClient.post('auth/register', { json: data }).json<{
      success: boolean;
      data: any;
    }>();
    return response.data;
  },
};
