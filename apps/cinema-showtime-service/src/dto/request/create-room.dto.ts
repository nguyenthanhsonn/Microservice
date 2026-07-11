import { IsEnum, IsInt, IsNotEmpty, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { ScreeningFormat } from '../../enums/showtime.enum';

export class CreateRoomDto {
  @IsUUID()
  cinema_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsEnum(ScreeningFormat)
  format: ScreeningFormat;

  @IsInt()
  @Min(1)
  @Max(26)
  total_rows: number;

  @IsInt()
  @Min(1)
  @Max(50)
  total_columns: number;
}
