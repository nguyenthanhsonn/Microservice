import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { PaymentProvider } from '../../enums/payment.enum';

export class CreatePaymentRequestDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  bookingId: string;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;
}
