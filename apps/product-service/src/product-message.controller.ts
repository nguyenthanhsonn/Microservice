import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PRODUCT_PATTERNS } from '@app/contracts';
import { ProductService } from './product.service';

@Controller()
export class ProductMessageController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(PRODUCT_PATTERNS.CREATE)
  create(@Payload() payload: any) {
    return this.productService.create(payload);
  }

  @MessagePattern(PRODUCT_PATTERNS.UPDATE)
  update(@Payload() payload: { id: string; data: any }) {
    return this.productService.update(payload.id, payload.data);
  }

  @MessagePattern(PRODUCT_PATTERNS.DELETE)
  delete(@Payload() payload: { id: string }) {
    return this.productService.delete(payload.id);
  }

  @MessagePattern(PRODUCT_PATTERNS.FIND_ALL)
  findAll(@Payload() payload: any) {
    return this.productService.findAll(payload);
  }

  @MessagePattern(PRODUCT_PATTERNS.FIND_AVAILABLE)
  findAvailable() {
    return this.productService.findAvailable();
  }
}
