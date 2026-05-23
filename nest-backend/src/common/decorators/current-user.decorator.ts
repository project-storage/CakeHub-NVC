import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../types';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as { id: number; email: string; role: string };
  },
);
