import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, envValidationSchema } from '@app/config';
import { DatabaseModule } from '@app/database';
import { Product } from './entities/product.entity';
import { HealthMessageController } from './health-message.controller';
import { ProductMessageController } from './product-message.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig], validationSchema: envValidationSchema }),
    DatabaseModule.forRoot([Product])
  ],
  controllers: [HealthMessageController, ProductMessageController],
  providers: [ProductService]
})
export class ProductModule {}
