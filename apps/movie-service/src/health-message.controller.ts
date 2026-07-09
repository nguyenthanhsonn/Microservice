import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { health } from '@app/common';
import { ServicePatterns } from '@app/contracts';

@Controller()
export class HealthMessageController {
  @MessagePattern(ServicePatterns.health)
  health() {
    return health('movie-service');
  }
}
