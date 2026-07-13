import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES, TICKET_PATTERNS } from '@app/contracts';

@Controller('tickets')
export class TicketGatewayController {
  constructor(@Inject(SERVICE_NAMES.TICKET) private readonly ticketClient: ClientProxy) {}

  @Post('verify')
  verify(@Body() body: { qr_payload: string }) {
    return firstValueFrom(this.ticketClient.send(TICKET_PATTERNS.VERIFY, body));
  }

  @Post('check-in')
  checkIn(@Body() body: { ticketId: string; staffId: string }) {
    return firstValueFrom(this.ticketClient.send(TICKET_PATTERNS.CHECK_IN, body));
  }

  @Get('booking/:bookingId')
  findByBooking(@Param('bookingId') bookingId: string) {
    return firstValueFrom(this.ticketClient.send(TICKET_PATTERNS.FIND_BY_BOOKING, { bookingId }));
  }
}
