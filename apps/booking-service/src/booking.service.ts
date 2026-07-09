import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/request/create-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(@InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>) {}

  create(dto: CreateBookingDto) {
    return this.bookingRepository.save(this.bookingRepository.create(dto));
  }

  findById(id: string) {
    return this.bookingRepository.findOneBy({ id });
  }
}
