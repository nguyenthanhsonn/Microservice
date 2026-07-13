import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { appConfig, envValidationSchema } from '@app/config';
import { SERVICE_NAMES } from '@app/contracts';
import { DatabaseModule } from '@app/database';
import { BookingMessageController } from './booking-message.controller';
import { BookingService } from './booking.service';
import { BookingProduct } from './entities/booking-product.entity';
import { BookingSeat } from './entities/booking-seat.entity';
import { Booking } from './entities/booking.entity';
import { HealthMessageController } from './health-message.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig], validationSchema: envValidationSchema }),
    DatabaseModule.forRoot([Booking, BookingSeat, BookingProduct]),
    ClientsModule.registerAsync([
      {
        name: SERVICE_NAMES.CINEMA_SHOWTIME,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('CINEMA_SHOWTIME_SERVICE_HOST') ?? 'localhost',
            port: config.get<number>('CINEMA_SHOWTIME_SERVICE_PORT') ?? 3003,
          },
        }),
      },
      {
        name: SERVICE_NAMES.PRODUCT,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('PRODUCT_SERVICE_HOST') ?? 'localhost',
            port: config.get<number>('PRODUCT_SERVICE_PORT') ?? 3008,
          },
        }),
      },
    ]),
  ],
  controllers: [HealthMessageController, BookingMessageController],
  providers: [BookingService]
})
export class BookingModule {}
