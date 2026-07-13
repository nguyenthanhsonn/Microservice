import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketStatus } from './enums/ticket.enum';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
  ) {}

  async issueForBooking(booking: any) {
    if (booking.status !== 'paid') {
      throw new BadRequestException('Chỉ sinh vé cho booking đã thanh toán');
    }

    const existed = await this.ticketRepo.findOne({
      where: { booking_id: booking.id, status: TicketStatus.VALID },
    });

    if (existed) {
      return {
        success: true,
        data: {
          message: 'Ticket đã tồn tại',
          ticket: this.toTicketDto(existed),
        },
      };
    }

    const ticketCode = this.generateTicketCode();
    const seatLabels = booking.seats
      .map((seat: any) => `${seat.seat_row}${seat.seat_number}`)
      .join(', ');

    const qrPayload = JSON.stringify({
      version: 1,
      ticket_code: ticketCode,
      booking_id: booking.id,
    });

    const ticket = await this.ticketRepo.save({
      ticket_code: ticketCode,
      booking_id: booking.id,
      booking_code: booking.booking_code,
      user_id: booking.user_id,
      movie_title: booking.movie.title,
      cinema_name: booking.cinema.name,
      room_name: booking.room.name,
      show_date: booking.showtime.show_date,
      start_time: booking.showtime.start_time,
      seat_labels: seatLabels,
      qr_payload: qrPayload,
      qr_code_url: null,
      status: TicketStatus.VALID,
      checked_in_at: null,
      checked_in_by: null,
    });

    return {
      success: true,
      data: {
        message: 'Sinh vé thành công',
        ticket: this.toTicketDto(ticket),
      },
    };
  }

  async findByBooking(bookingId: string) {
    const tickets = await this.ticketRepo.find({
      where: { booking_id: bookingId },
      order: { created_at: 'DESC' },
    });

    return {
      success: true,
      data: {
        tickets: tickets.map((ticket) => this.toTicketDto(ticket)),
      },
    };
  }

  async verify(qrPayload: string) {
    let parsed: { ticket_code?: string; booking_id?: string };

    try {
      parsed = JSON.parse(qrPayload);
    } catch {
      throw new BadRequestException('QR không hợp lệ');
    }

    const ticket = await this.ticketRepo.findOne({
      where: {
        ticket_code: parsed.ticket_code,
        booking_id: parsed.booking_id,
      },
    });

    if (!ticket) throw new NotFoundException('Không tìm thấy vé');

    return {
      success: true,
      data: {
        valid: ticket.status === TicketStatus.VALID,
        ticket: this.toTicketDto(ticket),
      },
    };
  }

  async checkIn(ticketId: string, staffId: string) {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('Không tìm thấy vé');

    if (ticket.status === TicketStatus.CANCELLED) {
      throw new BadRequestException('Vé đã bị hủy');
    }

    if (ticket.status === TicketStatus.USED) {
      return {
        success: true,
        data: {
          message: 'Vé đã được check-in trước đó',
          ticket: this.toTicketDto(ticket),
        },
      };
    }

    ticket.status = TicketStatus.USED;
    ticket.checked_in_at = new Date();
    ticket.checked_in_by = staffId;

    await this.ticketRepo.save(ticket);

    return {
      success: true,
      data: {
        message: 'Check-in thành công',
        ticket: this.toTicketDto(ticket),
      },
    };
  }

  private toTicketDto(ticket: Ticket) {
    return {
      id: ticket.id,
      ticket_code: ticket.ticket_code,
      booking_id: ticket.booking_id,
      booking_code: ticket.booking_code,
      user_id: ticket.user_id,
      movie_title: ticket.movie_title,
      cinema_name: ticket.cinema_name,
      room_name: ticket.room_name,
      show_date: ticket.show_date,
      start_time: ticket.start_time,
      seat_labels: ticket.seat_labels,
      qr_payload: ticket.qr_payload,
      qr_code_url: ticket.qr_code_url,
      status: ticket.status,
      checked_in_at: ticket.checked_in_at,
    };
  }

  private generateTicketCode() {
    return `TKT${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
  }
}
