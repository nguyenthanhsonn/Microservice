import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES, ServicePatterns } from '@app/contracts';

@Controller('products')
export class ProductGatewayController {
  constructor(@Inject(SERVICE_NAMES.PRODUCT) private readonly productClient: ClientProxy) {}

  @Get()
  list() {
    return firstValueFrom(this.productClient.send(ServicePatterns.product.list, {}));
  }
}
