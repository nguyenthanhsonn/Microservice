import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { appConfig, envValidationSchema } from '@app/config';
import { DatabaseModule } from '@app/database';
import { AuthMessageController } from './auth/auth-message.controller';
import { AuthService } from './auth/auth.service';
import { CustomerProfile } from './entities/customer-profile.entity';
import { StaffProfile } from './entities/staff-profile.entity';
import { User } from './entities/user.entity';
import { HealthMessageController } from './health-message.controller';
import { UserMessageController } from './user/user-message.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig], validationSchema: envValidationSchema }),
    DatabaseModule.forRoot([User, CustomerProfile, StaffProfile]),
    JwtModule.register({}),
  ],
  controllers: [HealthMessageController, AuthMessageController, UserMessageController],
  providers: [AuthService, UserService]
})
export class AuthUserModule {}
