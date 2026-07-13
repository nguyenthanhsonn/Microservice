export class CancelBookingResponseDto {
  success: boolean;
  data: {
    message: string;
    booking_id: string;
    status: string;
  };
}
