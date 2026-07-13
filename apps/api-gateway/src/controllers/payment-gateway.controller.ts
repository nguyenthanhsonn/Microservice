import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES, PAYMENT_PATTERNS } from '@app/contracts';

@Controller('payments')
export class PaymentGatewayController {
  constructor(@Inject(SERVICE_NAMES.PAYMENT) private readonly paymentClient: ClientProxy) {}

  @Post()
  create(@Body() body: unknown) {
    return firstValueFrom(this.paymentClient.send(PAYMENT_PATTERNS.CREATE_PAYMENT, body));
  }

  @Post('mark-success')
  markSuccess(@Body() body: { paymentId: string }) {
    return firstValueFrom(this.paymentClient.send(PAYMENT_PATTERNS.MARK_SUCCESS, body));
  }

  @Get('booking/:bookingId')
  getByBooking(@Param('bookingId') bookingId: string) {
    return firstValueFrom(this.paymentClient.send(PAYMENT_PATTERNS.GET_BY_BOOKING, { bookingId }));
  }
}
