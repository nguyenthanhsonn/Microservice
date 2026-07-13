import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { CreateBookingRequestDto } from './create-booking.request.dto';

export class CreateBookingPayloadRequestDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ValidateNested()
  @Type(() => CreateBookingRequestDto)
  data: CreateBookingRequestDto;
}
