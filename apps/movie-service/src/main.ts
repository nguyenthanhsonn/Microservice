import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MovieModule } from './movie.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(MovieModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.MOVIE_SERVICE_BIND_HOST ?? '0.0.0.0',
      port: Number(process.env.MOVIE_SERVICE_PORT ?? 3002)
    }
  });

  await app.listen();
}

bootstrap();
