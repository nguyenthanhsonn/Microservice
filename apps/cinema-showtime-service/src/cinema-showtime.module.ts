import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, envValidationSchema } from '@app/config';
import { DatabaseModule } from '@app/database';
import { CinemaService } from './cinema/cinema.service';
import { CinemaShowtimeMessageController } from './cinema-showtime-message.controller';
import { Cinema } from './entities/cinema.entity';
import { HealthMessageController } from './health-message.controller';
import { Room } from './entities/room.entity';
import { Seat } from './entities/seat.entity';
import { Showtime } from './entities/showtime.entity';
import { ShowtimeSeat } from './entities/showtime-seat.entity';
import { ShowtimeService } from './showtime/showtime.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig], validationSchema: envValidationSchema }),
    DatabaseModule.forRoot([Cinema, Room, Seat, Showtime, ShowtimeSeat])
  ],
  controllers: [HealthMessageController, CinemaShowtimeMessageController],
  providers: [CinemaService, ShowtimeService]
})
export class CinemaShowtimeModule {}
