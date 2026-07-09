import { CreatePaymentDto } from '../dto/request/create-payment.dto';

export interface PaymentProvider {
  charge(dto: CreatePaymentDto): Promise<{ providerTransactionId: string; status: string }>;
}
