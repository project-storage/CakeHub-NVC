import ky from 'ky';
import { useAuthStore } from '@/store/useAuthStore';

const isServer = typeof window === 'undefined';

export const apiClient = ky.create({
  prefix: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 10000,
  hooks: {
    beforeRequest: [
      // @ts-expect-error ky type incompatibility
      (request: unknown) => {
        if (!isServer) {
          const token = useAuthStore.getState().token;
          if (token && request && (request as Request).headers) {
             (request as Request).headers.set('Authorization', `Bearer ${token}`);
          }
        }
      }
    ],
    afterResponse: [
      // @ts-expect-error ky type incompatibility
      async (request: unknown, options?: unknown, response?: unknown) => {
        // Handle both older ky v2 parameters (request, options, response) and v3 parameter objects
        const res = (response as Response) || ((request as Record<string, unknown>)?.response as Response) || (request as Response);
        if (res && res.status === 401) {
          if (!isServer) {
             useAuthStore.getState().logout();
             window.location.href = '/login';
          }
        }
      }
    ]
  }
} as ReturnType<typeof ky.create>);
