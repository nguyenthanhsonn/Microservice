import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BookingModule } from './booking.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(BookingModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.BOOKING_SERVICE_BIND_HOST ?? '0.0.0.0',
      port: Number(process.env.BOOKING_SERVICE_PORT ?? 3004)
    }
  });

  await app.listen();
}

bootstrap();
