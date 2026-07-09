import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, envValidationSchema } from '@app/config';
import { DatabaseModule } from '@app/database';
import { Ticket } from './entities/ticket.entity';
import { HealthMessageController } from './health-message.controller';
import { QrService } from './qr/qr.service';
import { TicketMessageController } from './ticket-message.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig], validationSchema: envValidationSchema }),
    DatabaseModule.forRoot([Ticket])
  ],
  controllers: [HealthMessageController, TicketMessageController],
  providers: [TicketService, QrService]
})
export class TicketModule {}
