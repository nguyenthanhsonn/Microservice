import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationPatterns } from '@app/contracts';
import { SendEmailDto } from './dto/request/send-email.dto';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationMessageController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern(NotificationPatterns.sendEmail)
  sendEmail(@Payload() payload: SendEmailDto) {
    return this.notificationService.sendEmail(payload);
  }
}
