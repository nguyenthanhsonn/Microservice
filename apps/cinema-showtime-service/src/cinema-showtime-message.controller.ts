import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CinemaPatterns, ShowtimePatterns } from '@app/contracts';
import { CinemaService } from './cinema/cinema.service';
import { ShowtimeService } from './showtime/showtime.service';

@Controller()
export class CinemaShowtimeMessageController {
  constructor(
    private readonly cinemaService: CinemaService,
    private readonly showtimeService: ShowtimeService
  ) {}

  @MessagePattern(CinemaPatterns.list)
  listCinemas() {
    return this.cinemaService.list();
  }

  @MessagePattern(ShowtimePatterns.list)
  listShowtimes() {
    return this.showtimeService.list();
  }
}
