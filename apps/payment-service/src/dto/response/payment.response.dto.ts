import { PaymentProvider, PaymentStatus } from '../../enums/payment.enum';

export class PaymentResponseDto {
  id: string;
  booking_id: string;
  booking_code: string;
  user_id: string;
  amount: number;
  provider: PaymentProvider;
  status: PaymentStatus;
  payment_link_id: string | null;
  checkout_url: string | null;
  paid_at: Date | null;
}
