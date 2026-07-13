import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { appConfig, envValidationSchema } from '@app/config';
import { DatabaseModule } from '@app/database';
import { SERVICE_NAMES } from '@app/contracts';
import { Payment } from './entities/payment.entity';
import { HealthMessageController } from './health-message.controller';
import { PaymentMessageController } from './payment-message.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig], validationSchema: envValidationSchema }),
    DatabaseModule.forRoot([Payment]),
    ClientsModule.registerAsync([
      {
        name: SERVICE_NAMES.BOOKING,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('BOOKING_SERVICE_HOST') ?? 'localhost',
            port: config.get<number>('BOOKING_SERVICE_PORT') ?? 3004,
          },
        }),
      },
      {
        name: SERVICE_NAMES.TICKET,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('TICKET_SERVICE_HOST') ?? 'localhost',
            port: config.get<number>('TICKET_SERVICE_PORT') ?? 3006,
          },
        }),
      },
    ]),
  ],
  controllers: [HealthMessageController, PaymentMessageController],
  providers: [PaymentService],
})
export class PaymentModule {}
