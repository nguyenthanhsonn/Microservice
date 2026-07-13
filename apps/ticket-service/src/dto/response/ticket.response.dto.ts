import { TicketStatus } from '../../enums/ticket.enum';

export class TicketResponseDto {
  id: string;
  ticket_code: string;
  booking_id: string;
  booking_code: string;
  user_id: string;
  movie_title: string;
  cinema_name: string;
  room_name: string;
  show_date: string;
  start_time: string;
  seat_labels: string;
  qr_payload: string;
  qr_code_url: string | null;
  status: TicketStatus;
  checked_in_at: Date | null;
}
