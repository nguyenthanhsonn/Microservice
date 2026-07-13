import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class GetMyBookingsRequestDto {
  @IsUUID()
  userId: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;
}
