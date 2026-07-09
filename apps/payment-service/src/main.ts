import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(PaymentModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.PAYMENT_SERVICE_BIND_HOST ?? '0.0.0.0',
      port: Number(process.env.PAYMENT_SERVICE_PORT ?? 3005)
    }
  });

  await app.listen();
}

bootstrap();
