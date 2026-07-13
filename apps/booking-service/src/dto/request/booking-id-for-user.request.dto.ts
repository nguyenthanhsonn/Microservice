import { IsNotEmpty, IsUUID } from 'class-validator';

export class BookingIdForUserRequestDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  bookingId: string;
}
