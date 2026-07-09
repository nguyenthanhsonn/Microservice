import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES, ServicePatterns } from '@app/contracts';

@Controller('payments')
export class PaymentGatewayController {
  constructor(@Inject(SERVICE_NAMES.PAYMENT) private readonly paymentClient: ClientProxy) {}

  @Post()
  create(@Body() body: unknown) {
    return firstValueFrom(this.paymentClient.send(ServicePatterns.payment.create, body));
  }
}
