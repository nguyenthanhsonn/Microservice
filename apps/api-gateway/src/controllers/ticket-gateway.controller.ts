import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES, ServicePatterns } from '@app/contracts';

@Controller('tickets')
export class TicketGatewayController {
  constructor(@Inject(SERVICE_NAMES.TICKET) private readonly ticketClient: ClientProxy) {}

  @Post('issue')
  issue(@Body() body: unknown) {
    return firstValueFrom(this.ticketClient.send(ServicePatterns.ticket.issue, body));
  }
}
