import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MovieService {
  constructor(@InjectRepository(Movie) private readonly movieRepository: Repository<Movie>) {}

  list() {
    return this.movieRepository.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: string) {
    return this.movieRepository.findOneBy({ id });
  }
}
