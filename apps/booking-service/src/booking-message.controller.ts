import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookingPatterns } from '@app/contracts';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/request/create-booking.dto';

@Controller()
export class BookingMessageController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern(BookingPatterns.create)
  create(@Payload() payload: CreateBookingDto) {
    return this.bookingService.create(payload);
  }

  @MessagePattern(BookingPatterns.findById)
  findById(@Payload() payload: { id: string }) {
    return this.bookingService.findById(payload.id);
  }
}
