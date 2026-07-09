import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CinemaShowtimeModule } from './cinema-showtime.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(CinemaShowtimeModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.CINEMA_SHOWTIME_SERVICE_BIND_HOST ?? '0.0.0.0',
      port: Number(process.env.CINEMA_SHOWTIME_SERVICE_PORT ?? 3003)
    }
  });

  await app.listen();
}

bootstrap();
