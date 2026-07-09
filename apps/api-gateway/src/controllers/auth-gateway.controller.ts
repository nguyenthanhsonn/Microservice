import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES, ServicePatterns } from '@app/contracts';

@Controller('auth')
export class AuthGatewayController {
  constructor(@Inject(SERVICE_NAMES.AUTH_USER) private readonly authUserClient: ClientProxy) {}

  @Post('validate-token')
  validateToken(@Body() body: { token?: string }) {
    return firstValueFrom(this.authUserClient.send(ServicePatterns.auth.validateToken, body));
  }
}
