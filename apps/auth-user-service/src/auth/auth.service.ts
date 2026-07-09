import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  validateToken(token?: string) {
    return {
      valid: Boolean(token),
      userId: token ? 'placeholder-user-id' : null
    };
  }
}
