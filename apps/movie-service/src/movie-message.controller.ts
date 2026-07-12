import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MOVIE_PATTERNS } from '@app/contracts';
import { MovieService } from './movie.service';

@Controller()
export class MovieMessageController {
  constructor(private readonly movieService: MovieService) {}

  @MessagePattern(MOVIE_PATTERNS.CREATE)
  create(@Payload() payload: any) {
    return this.movieService.create(payload);
  }

  @MessagePattern(MOVIE_PATTERNS.FIND_ALL)
  findAll() {
    return this.movieService.findAll();
  }

  @MessagePattern(MOVIE_PATTERNS.FIND_DETAIL)
  findDetail(@Payload() payload: { id: string }) {
    return this.movieService.findDetail(payload.id);
  }

  @MessagePattern(MOVIE_PATTERNS.FIND_SHOWING)
  findShowing() {
    return this.movieService.findByStatus('NOW_SHOWING');
  }

  @MessagePattern(MOVIE_PATTERNS.FIND_COMING_SOON)
  findComingSoon() {
    return this.movieService.findByStatus('COMING_SOON');
  }
}
