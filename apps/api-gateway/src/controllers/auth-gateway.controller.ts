import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AUTH_PATTERNS, SERVICE_NAMES } from '@app/contracts';

@Controller('auth')
export class AuthGatewayController {
  constructor(@Inject(SERVICE_NAMES.AUTH_USER) private readonly authUserClient: ClientProxy) {}

  @Post('register')
  register(@Body() body: unknown) {
    return firstValueFrom(this.authUserClient.send(AUTH_PATTERNS.REGISTER, body));
  }

  @Post('login')
  login(@Body() body: unknown) {
    return firstValueFrom(this.authUserClient.send(AUTH_PATTERNS.LOGIN, body));
  }

  @Post('verify-otp')
  verifyOtp(@Body() body: { email: string; otp_code: string }) {
    return firstValueFrom(this.authUserClient.send(AUTH_PATTERNS.VERIFY_OTP, body));
  }

  @Post('refresh-token')
  refreshToken(@Body() body: { refresh_token: string }) {
    return firstValueFrom(this.authUserClient.send(AUTH_PATTERNS.REFRESH_TOKEN, body));
  }

  @Post('logout')
  logout(@Body() body: { email: string }) {
    return firstValueFrom(this.authUserClient.send(AUTH_PATTERNS.LOGOUT, body));
  }

  @Post('validate-token')
  validateToken(@Body() body: { token?: string }) {
    return firstValueFrom(this.authUserClient.send(AUTH_PATTERNS.VALIDATE_TOKEN, body));
  }
}
