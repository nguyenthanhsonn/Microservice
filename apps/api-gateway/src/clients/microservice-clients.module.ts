import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, ClientsProviderAsyncOptions, TcpClientOptions, Transport } from '@nestjs/microservices';
import { SERVICE_NAMES } from '@app/contracts';

const tcpClient = (
  name: string,
  hostKey: string,
  portKey: string,
  defaultPort: number,
): ClientsProviderAsyncOptions => ({
  name,
  inject: [ConfigService],
  useFactory: (config: ConfigService): TcpClientOptions => ({
    transport: Transport.TCP,
    options: {
      host: config.get<string>(hostKey) ?? 'localhost',
      port: config.get<number>(portKey) ?? defaultPort,
    },
  }),
});

@Module({
  imports: [
    ClientsModule.registerAsync([
      tcpClient(SERVICE_NAMES.AUTH_USER, 'AUTH_USER_SERVICE_HOST', 'AUTH_USER_SERVICE_PORT', 3001),
      tcpClient(SERVICE_NAMES.MOVIE, 'MOVIE_SERVICE_HOST', 'MOVIE_SERVICE_PORT', 3002),
      tcpClient(SERVICE_NAMES.CINEMA_SHOWTIME, 'CINEMA_SHOWTIME_SERVICE_HOST', 'CINEMA_SHOWTIME_SERVICE_PORT', 3003),
      tcpClient(SERVICE_NAMES.BOOKING, 'BOOKING_SERVICE_HOST', 'BOOKING_SERVICE_PORT', 3004),
      tcpClient(SERVICE_NAMES.PAYMENT, 'PAYMENT_SERVICE_HOST', 'PAYMENT_SERVICE_PORT', 3005),
      tcpClient(SERVICE_NAMES.TICKET, 'TICKET_SERVICE_HOST', 'TICKET_SERVICE_PORT', 3006),
      tcpClient(SERVICE_NAMES.NOTIFICATION, 'NOTIFICATION_SERVICE_HOST', 'NOTIFICATION_SERVICE_PORT', 3007),
      tcpClient(SERVICE_NAMES.PRODUCT, 'PRODUCT_SERVICE_HOST', 'PRODUCT_SERVICE_PORT', 3008),
    ]),
  ],
  exports: [ClientsModule],
})
export class GatewayClientsModule {}
