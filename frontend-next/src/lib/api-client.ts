import ky from 'ky';
import { useAuthStore } from '@/store/useAuthStore';

const isServer = typeof window === 'undefined';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient = ky.create({
  prefix: API_URL,
  timeout: 45000,
  hooks: {
    beforeRequest: [
      (request: any) => {
        const req = request.request || request;
        if (!isServer) {
          const token = useAuthStore.getState().token;
          if (token && req && req.headers) {
            req.headers.set('Authorization', `Bearer ${token}`);
          }
        }
      }
    ],
    afterResponse: [
      // @ts-ignore - Ignore Ky hooks parameter count differences across versions
      async (request: any, options: any, response: any) => {
        const req = request.request || request;
        const res = response || request.response || response;
        
        if (res && res.status === 401 && !isServer) {
          const refreshToken = useAuthStore.getState().refreshToken;
          
          if (refreshToken) {
            try {
              // Attempt token rotation
              const refreshResponse = await ky.post(`${API_URL}/auth/refresh`, {
                json: { refreshToken }
              }).json<{ success: boolean; data: { accessToken: string; refreshToken: string } }>();

              if (refreshResponse.success) {
                const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
                const user = useAuthStore.getState().user;
                if (user) {
                  useAuthStore.getState().setAuth(user, accessToken, newRefreshToken);
                }

                // Retry original request with the new access token
                if (req && req.headers) {
                  req.headers.set('Authorization', `Bearer ${accessToken}`);
                }
                return ky(req);
              }
            } catch (error) {
              console.error('Session refresh failed:', error);
            }
          }

          // Force logout if refresh token expires or is invalid
          useAuthStore.getState().logout();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        return res;
      }
    ]
  }
});
