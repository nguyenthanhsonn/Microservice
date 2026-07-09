import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES, ServicePatterns } from '@app/contracts';

@Controller('users')
export class UserGatewayController {
  constructor(@Inject(SERVICE_NAMES.AUTH_USER) private readonly authUserClient: ClientProxy) {}

  @Get(':id')
  findById(@Param('id') id: string) {
    return firstValueFrom(this.authUserClient.send(ServicePatterns.user.findById, { id }));
  }
}
