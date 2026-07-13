import { BookingResponseDto } from './booking.response.dto';

export class GetBookingDetailResponseDto {
  success: boolean;
  data: {
    booking: BookingResponseDto;
  };
}
