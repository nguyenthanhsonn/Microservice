import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MoviePatterns } from '@app/contracts';
import { MovieService } from './movie.service';

@Controller()
export class MovieMessageController {
  constructor(private readonly movieService: MovieService) {}

  @MessagePattern(MoviePatterns.list)
  list() {
    return this.movieService.list();
  }

  @MessagePattern(MoviePatterns.findById)
  findById(@Payload() payload: { id: string }) {
    return this.movieService.findById(payload.id);
  }
}
