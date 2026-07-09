import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES, ServicePatterns } from '@app/contracts';
import { health } from '@app/common';

@Controller('health')
export class HealthController {
  constructor(
    @Inject(SERVICE_NAMES.AUTH_USER) private readonly authUserClient: ClientProxy,
    @Inject(SERVICE_NAMES.MOVIE) private readonly movieClient: ClientProxy,
    @Inject(SERVICE_NAMES.CINEMA_SHOWTIME) private readonly cinemaShowtimeClient: ClientProxy,
    @Inject(SERVICE_NAMES.BOOKING) private readonly bookingClient: ClientProxy,
    @Inject(SERVICE_NAMES.PAYMENT) private readonly paymentClient: ClientProxy,
    @Inject(SERVICE_NAMES.TICKET) private readonly ticketClient: ClientProxy,
    @Inject(SERVICE_NAMES.NOTIFICATION) private readonly notificationClient: ClientProxy,
    @Inject(SERVICE_NAMES.PRODUCT) private readonly productClient: ClientProxy
  ) {}

  @Get()
  check() {
    return health('api-gateway');
  }

  @Get('services')
  async checkServices() {
    const services = [
      this.authUserClient,
      this.movieClient,
      this.cinemaShowtimeClient,
      this.bookingClient,
      this.paymentClient,
      this.ticketClient,
      this.notificationClient,
      this.productClient
    ];

    const downstream = await Promise.allSettled(
      services.map((service) => firstValueFrom(service.send(ServicePatterns.health, {})))
    );

    return {
      gateway: health('api-gateway'),
      services: downstream.map((result) => (result.status === 'fulfilled' ? result.value : { status: 'down' }))
    };
  }
}
