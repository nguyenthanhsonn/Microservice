import { BookingResponseDto } from './booking.response.dto';

export class GetMyBookingsResponseDto {
  success: boolean;
  data: {
    bookings: BookingResponseDto[];
    total: number;
    page: number;
    limit: number;
  };
}
