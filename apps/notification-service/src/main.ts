import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationModule } from './notification.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.NOTIFICATION_SERVICE_BIND_HOST ?? '0.0.0.0',
      port: Number(process.env.NOTIFICATION_SERVICE_PORT ?? 3007)
    }
  });

  await app.listen();
}

bootstrap();
