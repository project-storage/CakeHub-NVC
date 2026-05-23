import { Role } from '@prisma/client';

export interface UserPayload {
  email: string;
  sub: number;
  role: Role;
}

export interface SafeUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
