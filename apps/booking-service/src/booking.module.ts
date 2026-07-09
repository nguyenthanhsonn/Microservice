import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, envValidationSchema } from '@app/config';
import { DatabaseModule } from '@app/database';
import { BookingMessageController } from './booking-message.controller';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';
import { HealthMessageController } from './health-message.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig], validationSchema: envValidationSchema }),
    DatabaseModule.forRoot([Booking])
  ],
  controllers: [HealthMessageController, BookingMessageController],
  providers: [BookingService]
})
export class BookingModule {}
