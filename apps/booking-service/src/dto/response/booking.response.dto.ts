import { BookingStatus } from '../../enums/booking-status.enum';
import { BookingProductResponseDto } from './booking-product.response.dto';
import { BookingSeatResponseDto } from './booking-seat.response.dto';

export class BookingResponseDto {
  id: string;
  booking_code: string;
  user_id: string;
  status: BookingStatus;

  movie: {
    id: string;
    title: string;
  };

  cinema: {
    id: string;
    name: string;
  };

  room: {
    id: string;
    name: string;
  };

  showtime: {
    id: string;
    show_date: string;
    start_time: string;
    end_time: string;
    format: string;
  };

  customer: {
    name: string;
    email: string;
    phone: string | null;
  };

  seats: BookingSeatResponseDto[];
  products: BookingProductResponseDto[];

  seat_total_price: number;
  product_total_price: number;
  total_price: number;

  created_at: Date;
  paid_at: Date | null;
  cancelled_at: Date | null;
}
