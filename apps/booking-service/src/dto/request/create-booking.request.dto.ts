import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { BookingProductRequestDto } from './booking-product.request.dto';

export class CreateBookingRequestDto {
  @IsUUID()
  @IsNotEmpty()
  showtime_id: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  showtime_seat_ids: string[];

  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @IsEmail()
  customer_email: string;

  @IsPhoneNumber('VN')
  @IsOptional()
  customer_phone?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingProductRequestDto)
  @IsOptional()
  products?: BookingProductRequestDto[];

  @IsString()
  @IsOptional()
  notes?: string;
}
