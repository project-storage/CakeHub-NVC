import { Role } from '@prisma/client';

export class UserPayload {
  email: string;
  sub: number;
  id: number;
  role: Role;
}

export class SafeUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
