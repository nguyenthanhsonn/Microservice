import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductPatterns } from '@app/contracts';
import { ProductService } from './product.service';

@Controller()
export class ProductMessageController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(ProductPatterns.list)
  list() {
    return this.productService.list();
  }
}
