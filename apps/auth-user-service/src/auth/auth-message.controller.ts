import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_PATTERNS } from '@app/contracts';
import { AuthService } from './auth.service';

@Controller()
export class AuthMessageController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  register(@Payload() payload: any) {
    return this.authService.register(payload);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  login(@Payload() payload: { email: string; password: string }) {
    return this.authService.login(payload);
  }

  @MessagePattern(AUTH_PATTERNS.VERIFY_OTP)
  verifyOtp(@Payload() payload: { email: string; otp_code: string }) {
    return this.authService.verifyOtp(payload);
  }

  @MessagePattern(AUTH_PATTERNS.REFRESH_TOKEN)
  refreshToken(@Payload() payload: { refresh_token: string }) {
    return this.authService.refreshToken(payload.refresh_token);
  }

  @MessagePattern(AUTH_PATTERNS.LOGOUT)
  logout(@Payload() payload: { email: string }) {
    return this.authService.logout(payload.email);
  }

  @MessagePattern(AUTH_PATTERNS.VALIDATE_TOKEN)
  validateToken(@Payload() payload: { token?: string }) {
    return this.authService.validateToken(payload.token);
  }
}
