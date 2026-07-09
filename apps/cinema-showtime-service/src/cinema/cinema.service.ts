import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cinema } from '../entities/cinema.entity';

@Injectable()
export class CinemaService {
  constructor(@InjectRepository(Cinema) private readonly cinemaRepository: Repository<Cinema>) {}

  list() {
    return this.cinemaRepository.find({ order: { name: 'ASC' } });
  }
}
