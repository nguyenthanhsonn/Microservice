import { Body, Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAMES, USER_PATTERNS } from '@app/contracts';

@Controller('users')
export class UserGatewayController {
  constructor(@Inject(SERVICE_NAMES.AUTH_USER) private readonly authUserClient: ClientProxy) {}

  @Get('customers')
  getCustomers() {
    return firstValueFrom(this.authUserClient.send(USER_PATTERNS.GET_CUSTOMERS, {}));
  }

  @Get('staffs')
  getStaffs() {
    return firstValueFrom(this.authUserClient.send(USER_PATTERNS.GET_STAFFS, {}));
  }

  @Post('staffs')
  createStaff(@Body() body: unknown) {
    return firstValueFrom(this.authUserClient.send(USER_PATTERNS.CREATE_STAFF, body));
  }

  @Get(':id')
  getProfile(@Param('id') id: string) {
    return firstValueFrom(this.authUserClient.send(USER_PATTERNS.GET_PROFILE, { id }));
  }

  @Patch(':id')
  updateProfile(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return firstValueFrom(this.authUserClient.send(USER_PATTERNS.UPDATE_PROFILE, { id, ...body }));
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return firstValueFrom(this.authUserClient.send(USER_PATTERNS.UPDATE_STATUS, { id, ...body }));
  }

  @Patch('staffs/:id/reset-password')
  resetStaffPassword(@Param('id') id: string, @Body() body: { password?: string }) {
    return firstValueFrom(this.authUserClient.send(USER_PATTERNS.RESET_STAFF_PASSWORD, { id, ...body }));
  }
}
