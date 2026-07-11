import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CinemaShowtimeMessageController } from './cinema-showtime-message.controller';
import { CinemaService } from './cinema/cinema.service';
import { Cinema } from './entities/cinema.entity';
import { Room } from './entities/room.entity';
import { Seat } from './entities/seat.entity';
import { ShowtimeSeat } from './entities/showtime-seat.entity';
import { Showtime } from './entities/showtime.entity';
import { HealthMessageController } from './health-message.controller';
import { ShowtimeService } from './showtime/showtime.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.getOrThrow<number>('DB_PORT'),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_DATABASE'),
        entities: [Cinema, Room, Seat, Showtime, ShowtimeSeat],
        synchronize: config.get<boolean>('DB_SYNCHRONIZE') ?? false,
        logging: config.get<boolean>('DB_LOGGING') ?? false,
      }),
    }),
    TypeOrmModule.forFeature([Cinema, Room, Seat, Showtime, ShowtimeSeat]),
  ],
  controllers: [CinemaShowtimeMessageController, HealthMessageController],
  providers: [CinemaService, ShowtimeService],
})
export class CinemaShowtimeModule {}
