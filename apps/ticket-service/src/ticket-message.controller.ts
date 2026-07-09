import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TicketPatterns } from '@app/contracts';
import { IssueTicketDto } from './dto/request/issue-ticket.dto';
import { TicketService } from './ticket.service';

@Controller()
export class TicketMessageController {
  constructor(private readonly ticketService: TicketService) {}

  @MessagePattern(TicketPatterns.issue)
  issue(@Payload() payload: IssueTicketDto) {
    return this.ticketService.issue(payload);
  }
}
