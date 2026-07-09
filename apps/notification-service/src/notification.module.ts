import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, envValidationSchema } from '@app/config';
import { HealthMessageController } from './health-message.controller';
import { MailService } from './mail/mail.service';
import { NotificationMessageController } from './notification-message.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [appConfig], validationSchema: envValidationSchema })],
  controllers: [HealthMessageController, NotificationMessageController],
  providers: [NotificationService, MailService]
})
export class NotificationModule {}
