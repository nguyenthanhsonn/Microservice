import { Injectable, Logger } from '@nestjs/common';
import { SendEmailDto } from '../dto/request/send-email.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async send(dto: SendEmailDto) {
    this.logger.log(`Email queued to ${dto.to}: ${dto.subject}`);
    return { queued: true };
  }
}
