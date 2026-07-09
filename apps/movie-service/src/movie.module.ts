import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, envValidationSchema } from '@app/config';
import { DatabaseModule } from '@app/database';
import { Movie } from './entities/movie.entity';
import { HealthMessageController } from './health-message.controller';
import { MovieMessageController } from './movie-message.controller';
import { MovieService } from './movie.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig], validationSchema: envValidationSchema }),
    DatabaseModule.forRoot([Movie])
  ],
  controllers: [HealthMessageController, MovieMessageController],
  providers: [MovieService]
})
export class MovieModule {}
