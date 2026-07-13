import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class BookingProductRequestDto {
  @IsUUID()
  @IsNotEmpty()
  product_id: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
