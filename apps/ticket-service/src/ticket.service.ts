import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IssueTicketDto } from './dto/request/issue-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { QrService } from './qr/qr.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>,
    private readonly qrService: QrService
  ) {}

  issue(dto: IssueTicketDto) {
    const qrCode = this.qrService.createPayload(dto.bookingId, dto.userId);
    return this.ticketRepository.save(this.ticketRepository.create({ ...dto, qrCode }));
  }
}
