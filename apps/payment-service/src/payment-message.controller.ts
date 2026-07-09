import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentPatterns } from '@app/contracts';
import { CreatePaymentDto } from './dto/request/create-payment.dto';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentMessageController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern(PaymentPatterns.create)
  create(@Payload() payload: CreatePaymentDto) {
    return this.paymentService.create(payload);
  }
}
