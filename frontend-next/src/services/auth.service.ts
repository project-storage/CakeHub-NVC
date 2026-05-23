import { apiClient } from '@/lib/api-client';
import { LoginDto, RegisterDto } from '@/types/auth';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post('auth/login', { json: data }).json<{
      success: boolean;
      data: AuthResponse;
    }>();
    return response.data;
  },

  register: async (data: RegisterDto): Promise<User> => {
    const response = await apiClient.post('auth/register', { json: data }).json<{
      success: boolean;
      data: User;
    }>();
    return response.data;
  },
};
