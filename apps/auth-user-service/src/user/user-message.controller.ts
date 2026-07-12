import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_PATTERNS } from '@app/contracts';
import { UserService } from './user.service';

@Controller()
export class UserMessageController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_PATTERNS.GET_PROFILE)
  getProfile(@Payload() payload: { id: string }) {
    return this.userService.getProfile(payload.id);
  }

  @MessagePattern(USER_PATTERNS.UPDATE_PROFILE)
  updateProfile(@Payload() payload: any) {
    return this.userService.updateProfile(payload);
  }

  @MessagePattern(USER_PATTERNS.GET_CUSTOMERS)
  getCustomers() {
    return this.userService.getCustomers();
  }

  @MessagePattern(USER_PATTERNS.GET_STAFFS)
  getStaffs() {
    return this.userService.getStaffs();
  }

  @MessagePattern(USER_PATTERNS.CREATE_STAFF)
  createStaff(@Payload() payload: any) {
    return this.userService.createStaff(payload);
  }

  @MessagePattern(USER_PATTERNS.UPDATE_STATUS)
  updateStatus(@Payload() payload: any) {
    return this.userService.updateStatus(payload);
  }

  @MessagePattern(USER_PATTERNS.RESET_STAFF_PASSWORD)
  resetStaffPassword(@Payload() payload: any) {
    return this.userService.resetStaffPassword(payload);
  }
}
