import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, envValidationSchema } from '@app/config';
import { HealthMessageController } from './health-message.controller';
import { PaymentMessageController } from './payment-message.controller';
import { PaymentService } from './payment.service';
import { MockPaymentProvider } from './providers/mock-payment.provider';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [appConfig], validationSchema: envValidationSchema })],
  controllers: [HealthMessageController, PaymentMessageController],
  providers: [PaymentService, MockPaymentProvider]
})
export class PaymentModule {}
