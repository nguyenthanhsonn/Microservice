import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TicketModule } from './ticket.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TicketModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.TICKET_SERVICE_BIND_HOST ?? '0.0.0.0',
      port: Number(process.env.TICKET_SERVICE_PORT ?? 3006)
    }
  });

  await app.listen();
}

bootstrap();
