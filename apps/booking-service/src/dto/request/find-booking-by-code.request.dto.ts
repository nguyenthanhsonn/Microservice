import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FindBookingByCodeRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  bookingCode: string;
}
