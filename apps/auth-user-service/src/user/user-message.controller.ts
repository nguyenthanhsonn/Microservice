import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserPatterns } from '@app/contracts';
import { UserService } from './user.service';

@Controller()
export class UserMessageController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserPatterns.findById)
  findById(@Payload() payload: { id: string }) {
    return this.userService.findById(payload.id);
  }
}
