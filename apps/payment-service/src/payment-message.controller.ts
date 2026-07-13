import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PAYMENT_PATTERNS } from '@app/contracts';
import { CreatePaymentRequestDto } from './dto/request/create-payment.request.dto';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentMessageController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern(PAYMENT_PATTERNS.CREATE_PAYMENT)
  createPayment(@Payload() payload: CreatePaymentRequestDto) {
    return this.paymentService.createPayment(payload);
  }

  @MessagePattern(PAYMENT_PATTERNS.MARK_SUCCESS)
  markSuccess(@Payload() payload: { paymentId: string }) {
    return this.paymentService.markSuccess(payload.paymentId);
  }

  @MessagePattern(PAYMENT_PATTERNS.GET_BY_BOOKING)
  getByBooking(@Payload() payload: { bookingId: string }) {
    return this.paymentService.getByBooking(payload.bookingId);
  }
}
