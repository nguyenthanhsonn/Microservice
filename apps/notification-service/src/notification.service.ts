import { Injectable } from '@nestjs/common';
import { SendEmailDto } from './dto/request/send-email.dto';
import { MailService } from './mail/mail.service';

@Injectable()
export class NotificationService {
  constructor(private readonly mailService: MailService) {}

  sendEmail(dto: SendEmailDto) {
    return this.mailService.send(dto);
  }
}
