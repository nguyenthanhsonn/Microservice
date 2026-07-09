import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  showtimeId: string;

  @IsArray()
  seatCodes: string[];
}
