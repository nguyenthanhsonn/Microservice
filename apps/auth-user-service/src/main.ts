import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthUserModule } from './auth-user.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthUserModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.AUTH_USER_SERVICE_BIND_HOST ?? '0.0.0.0',
      port: Number(process.env.AUTH_USER_SERVICE_PORT ?? 3001)
    }
  });

  await app.listen();
}

bootstrap();
