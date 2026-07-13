import { BookingResponseDto } from './booking.response.dto';

export class CreateBookingResponseDto {
  success: boolean;
  data: {
    message: string;
    booking: BookingResponseDto;
  };
}
