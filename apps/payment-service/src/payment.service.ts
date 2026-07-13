import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { BOOKING_PATTERNS, SERVICE_NAMES, TICKET_PATTERNS } from '@app/contracts';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { CreatePaymentRequestDto } from './dto/request/create-payment.request.dto';
import { Payment } from './entities/payment.entity';
import { PaymentStatus } from './enums/payment.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @Inject(SERVICE_NAMES.BOOKING)
    private readonly bookingClient: ClientProxy,
    @Inject(SERVICE_NAMES.TICKET)
    private readonly ticketClient: ClientProxy,
  ) {}

  async createPayment(dto: CreatePaymentRequestDto) {
    const bookingRes: any = await firstValueFrom(
      this.bookingClient.send(BOOKING_PATTERNS.FIND_BY_ID_FOR_USER, {
        userId: dto.userId,
        bookingId: dto.bookingId,
      }),
    );

    const booking = bookingRes.data.booking;

    if (booking.status !== 'pending') {
      throw new BadRequestException('Booking không ở trạng thái chờ thanh toán');
    }

    const existed = await this.paymentRepo.findOne({
      where: { booking_id: booking.id, status: PaymentStatus.PENDING },
    });

    if (existed) {
      return {
        success: true,
        data: {
          message: 'Payment đã tồn tại',
          payment: this.toPaymentDto(existed),
        },
      };
    }

    const payment = await this.paymentRepo.save({
      booking_id: booking.id,
      booking_code: booking.booking_code,
      user_id: booking.user_id,
      amount: booking.total_price,
      provider: dto.provider,
      status: PaymentStatus.PENDING,
      payment_link_id: `MOCK-${Date.now()}`,
      checkout_url: `http://localhost:3000/mock-payment/${booking.id}`,
      paid_at: null,
      failed_at: null,
    });

    return {
      success: true,
      data: {
        message: 'Tạo payment thành công',
        payment: this.toPaymentDto(payment),
      },
    };
  }

  async markSuccess(paymentId: string) {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException('Không tìm thấy payment');

    if (payment.status === PaymentStatus.SUCCESS) {
      return { success: true, data: { payment: this.toPaymentDto(payment) } };
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Chỉ payment pending mới được success');
    }

    payment.status = PaymentStatus.SUCCESS;
    payment.paid_at = new Date();
    await this.paymentRepo.save(payment);

    const bookingRes: any = await firstValueFrom(
      this.bookingClient.send(BOOKING_PATTERNS.MARK_PAID, {
        bookingId: payment.booking_id,
      }),
    );

    await firstValueFrom(
      this.ticketClient.send(TICKET_PATTERNS.ISSUE_FOR_BOOKING, {
        booking: bookingRes.data.booking,
      }),
    );

    return {
      success: true,
      data: {
        message: 'Thanh toán thành công',
        payment: this.toPaymentDto(payment),
      },
    };
  }

  async getByBooking(bookingId: string) {
    const payment = await this.paymentRepo.findOne({
      where: { booking_id: bookingId },
      order: { created_at: 'DESC' },
    });

    if (!payment) throw new NotFoundException('Không tìm thấy payment');

    return {
      success: true,
      data: { payment: this.toPaymentDto(payment) },
    };
  }

  private toPaymentDto(payment: Payment) {
    return {
      id: payment.id,
      booking_id: payment.booking_id,
      booking_code: payment.booking_code,
      user_id: payment.user_id,
      amount: Number(payment.amount),
      provider: payment.provider,
      status: payment.status,
      payment_link_id: payment.payment_link_id,
      checkout_url: payment.checkout_url,
      paid_at: payment.paid_at,
    };
  }
}
