import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES, ServicePatterns } from '@app/contracts';

@Controller()
export class CinemaShowtimeGatewayController {
  constructor(@Inject(SERVICE_NAMES.CINEMA_SHOWTIME) private readonly cinemaShowtimeClient: ClientProxy) {}

  @Get('cinemas')
  listCinemas() {
    return firstValueFrom(this.cinemaShowtimeClient.send(ServicePatterns.cinema.list, {}));
  }

  @Get('showtimes')
  listShowtimes() {
    return firstValueFrom(this.cinemaShowtimeClient.send(ServicePatterns.showtime.list, {}));
  }
}
