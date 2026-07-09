import { UserRole } from '@app/contracts';

export type AuthUserPayload = {
  sub: string;
  email?: string;
  role?: UserRole;
};