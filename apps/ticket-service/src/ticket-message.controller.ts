import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TICKET_PATTERNS } from '@app/contracts';
import { CheckInTicketRequestDto } from './dto/request/check-in-ticket.request.dto';
import { VerifyTicketRequestDto } from './dto/request/verify-ticket.request.dto';
import { TicketService } from './ticket.service';

@Controller()
export class TicketMessageController {
  constructor(private readonly ticketService: TicketService) {}

  @MessagePattern(TICKET_PATTERNS.ISSUE_FOR_BOOKING)
  issueForBooking(@Payload() payload: { booking: any }) {
    return this.ticketService.issueForBooking(payload.booking);
  }

  @MessagePattern(TICKET_PATTERNS.FIND_BY_BOOKING)
  findByBooking(@Payload() payload: { bookingId: string }) {
    return this.ticketService.findByBooking(payload.bookingId);
  }

  @MessagePattern(TICKET_PATTERNS.VERIFY)
  verify(@Payload() payload: VerifyTicketRequestDto) {
    return this.ticketService.verify(payload.qr_payload);
  }

  @MessagePattern(TICKET_PATTERNS.CHECK_IN)
  checkIn(@Payload() payload: CheckInTicketRequestDto) {
    return this.ticketService.checkIn(payload.ticketId, payload.staffId);
  }
}
