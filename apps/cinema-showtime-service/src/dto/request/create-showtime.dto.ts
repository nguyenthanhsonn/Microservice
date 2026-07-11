import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { ScreeningFormat } from '../../enums/showtime.enum';

export class CreateShowtimeDto {
  @IsUUID()
  movie_id: string;

  @IsString()
  @IsNotEmpty()
  movie_title: string;

  @IsNumber()
  @Min(1)
  movie_duration_minutes: number;

  @IsUUID()
  room_id: string;

  @IsDateString()
  show_date: string;

  @IsDateString()
  start_time: string;

  @IsEnum(ScreeningFormat)
  format: ScreeningFormat;

  @IsNumber()
  @Min(0)
  base_price: number;
}
