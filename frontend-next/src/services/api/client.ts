import ky from 'ky';
import { useAuthStore } from '@/store/useAuthStore';

const isServer = typeof window === 'undefined';

export const apiClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  hooks: {
    beforeRequest: [
      (request) => {
        if (!isServer) {
          const token = useAuthStore.getState().token;
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        }
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401 && !isServer) {
          const refreshToken = useAuthStore.getState().refreshToken;
          
          if (refreshToken) {
            try {
              // Try to refresh the token
              const refreshResponse = await ky.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/refresh`, {
                json: { refreshToken }
              }).json<{ success: boolean; data: { accessToken: string; refreshToken: string } }>();

              if (refreshResponse.success) {
                const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
                const user = useAuthStore.getState().user;
                if (user) {
                  useAuthStore.getState().setAuth(user, accessToken, newRefreshToken);
                }

                // Retry the original request with the new token
                request.headers.set('Authorization', `Bearer ${accessToken}`);
                return ky(request);
              }
            } catch (error) {
              console.error('Token refresh failed:', error);
            }
          }

          // If refresh fails or no refresh token, logout and redirect
          useAuthStore.getState().logout();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
    ]
  }
});
