import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductModule } from './product.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ProductModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.PRODUCT_SERVICE_BIND_HOST ?? '0.0.0.0',
      port: Number(process.env.PRODUCT_SERVICE_PORT ?? 3008)
    }
  });

  await app.listen();
}

bootstrap();
