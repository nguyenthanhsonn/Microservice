import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES, ServicePatterns } from '@app/contracts';

@Controller('notifications')
export class NotificationGatewayController {
  constructor(@Inject(SERVICE_NAMES.NOTIFICATION) private readonly notificationClient: ClientProxy) {}

  @Post('email')
  sendEmail(@Body() body: unknown) {
    return firstValueFrom(this.notificationClient.send(ServicePatterns.notification.sendEmail, body));
  }
}
