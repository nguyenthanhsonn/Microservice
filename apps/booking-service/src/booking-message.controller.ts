import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BOOKING_PATTERNS } from '@app/contracts';
import { BookingService } from './booking.service';
import { BookingIdForUserRequestDto } from './dto/request/booking-id-for-user.request.dto';
import { CreateBookingPayloadRequestDto } from './dto/request/create-booking-payload.request.dto';
import { FindBookingByCodeRequestDto } from './dto/request/find-booking-by-code.request.dto';
import { GetMyBookingsRequestDto } from './dto/request/get-my-bookings.request.dto';

@Controller()
export class BookingMessageController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern(BOOKING_PATTERNS.CREATE)
  create(@Payload() payload: CreateBookingPayloadRequestDto) {
    return this.bookingService.create(payload.userId, payload.data);
  }

  @MessagePattern(BOOKING_PATTERNS.FIND_MY_BOOKINGS)
  findMyBookings(@Payload() payload: GetMyBookingsRequestDto) {
    return this.bookingService.findMyBookings(payload);
  }

  @MessagePattern(BOOKING_PATTERNS.FIND_BY_ID_FOR_USER)
  findByIdForUser(@Payload() payload: BookingIdForUserRequestDto) {
    return this.bookingService.findByIdForUser(payload.userId, payload.bookingId);
  }

  @MessagePattern(BOOKING_PATTERNS.FIND_BY_CODE)
  findByCode(@Payload() payload: FindBookingByCodeRequestDto) {
    return this.bookingService.findByCode(payload.bookingCode);
  }

  @MessagePattern(BOOKING_PATTERNS.CANCEL)
  cancel(@Payload() payload: BookingIdForUserRequestDto) {
    return this.bookingService.cancel(payload.userId, payload.bookingId);
  }

  @MessagePattern(BOOKING_PATTERNS.MARK_PAID)
  markPaid(@Payload() payload: { bookingId: string }) {
    return this.bookingService.markPaid(payload.bookingId);
  }
}
