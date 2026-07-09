import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dto/request/create-payment.dto';
import { PaymentProvider } from './payment-provider.interface';

@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  async charge(dto: CreatePaymentDto) {
    return {
      providerTransactionId: `mock_${dto.bookingId}_${Date.now()}`,
      status: 'succeeded'
    };
  }
}
