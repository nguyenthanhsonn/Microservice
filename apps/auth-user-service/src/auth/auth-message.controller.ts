import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthPatterns } from '@app/contracts';
import { AuthService } from './auth.service';

@Controller()
export class AuthMessageController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthPatterns.validateToken)
  validateToken(@Payload() payload: { token?: string }) {
    return this.authService.validateToken(payload.token);
  }
}
