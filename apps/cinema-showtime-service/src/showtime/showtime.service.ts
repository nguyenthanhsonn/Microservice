import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from '../entities/showtime.entity';

@Injectable()
export class ShowtimeService {
  constructor(@InjectRepository(Showtime) private readonly showtimeRepository: Repository<Showtime>) {}

  list() {
    return this.showtimeRepository.find({ order: { startsAt: 'ASC' } });
  }
}
