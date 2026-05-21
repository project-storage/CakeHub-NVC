import ky from 'ky';
import { useAuthStore } from '@/store/useAuthStore';

const isServer = typeof window === 'undefined';

export const apiClient = ky.create({
  prefix: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  hooks: {
    beforeRequest: [
      (request: any) => {
        // Handle both (request) and ({ request })
        const req = request.request || request;
        if (!isServer) {
          const token = useAuthStore.getState().token;
          if (token && req.headers) {
            req.headers.set('Authorization', `Bearer ${token}`);
          }
        }
      }
    ],
    afterResponse: [
      // @ts-ignore - Handle varying hook signatures across ky versions
      async (arg1: any, arg2?: any, arg3?: any) => {
        // In newer ky, context is arg1. In older ky, response is arg3.
        const request = arg1.request || arg1;
        const response = arg3 || arg1.response || arg1; // Fallback to arg1 if it's the response itself

        if (response && response.status === 401 && !isServer) {
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
                const retryRequest = request.request || request;
                retryRequest.headers.set('Authorization', `Bearer ${accessToken}`);
                return ky(retryRequest);
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
        return response;
      }
    ]
  }
});
