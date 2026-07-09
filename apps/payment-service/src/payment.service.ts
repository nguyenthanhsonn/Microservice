import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/request/create-payment.dto';
import { MockPaymentProvider } from './providers/mock-payment.provider';

@Injectable()
export class PaymentService {
  constructor(private readonly provider: MockPaymentProvider) {}

  create(dto: CreatePaymentDto) {
    return this.provider.charge(dto);
  }
}
