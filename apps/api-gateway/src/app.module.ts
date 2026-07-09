import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, envValidationSchema } from '@app/config';
import { GatewayClientsModule } from './clients/microservice-clients.module';
import { AuthGatewayController } from './controllers/auth-gateway.controller';
import { BookingGatewayController } from './controllers/booking-gateway.controller';
import { CinemaShowtimeGatewayController } from './controllers/cinema-showtime-gateway.controller';
import { HealthController } from './controllers/health.controller';
import { MovieGatewayController } from './controllers/movie-gateway.controller';
import { NotificationGatewayController } from './controllers/notification-gateway.controller';
import { PaymentGatewayController } from './controllers/payment-gateway.controller';
import { ProductGatewayController } from './controllers/product-gateway.controller';
import { TicketGatewayController } from './controllers/ticket-gateway.controller';
import { UserGatewayController } from './controllers/user-gateway.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig],
      validationSchema: envValidationSchema,
    }),
    GatewayClientsModule,
  ],
  controllers: [
    HealthController,
    AuthGatewayController,
    UserGatewayController,
    MovieGatewayController,
    CinemaShowtimeGatewayController,
    BookingGatewayController,
    PaymentGatewayController,
    TicketGatewayController,
    ProductGatewayController,
    NotificationGatewayController,
  ],
})
export class AppModule {}
