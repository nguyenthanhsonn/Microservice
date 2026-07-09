import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES, ServicePatterns } from '@app/contracts';

@Controller('bookings')
export class BookingGatewayController {
  constructor(@Inject(SERVICE_NAMES.BOOKING) private readonly bookingClient: ClientProxy) {}

  @Post()
  create(@Body() body: unknown) {
    return firstValueFrom(this.bookingClient.send(ServicePatterns.booking.create, body));
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return firstValueFrom(this.bookingClient.send(ServicePatterns.booking.findById, { id }));
  }
}
