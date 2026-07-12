import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scrypt as scryptCallback, createHash } from 'crypto';
import { promisify } from 'util';
import { UserRole } from '@app/contracts';
import { DataSource, Repository } from 'typeorm';
import { CustomerProfile } from '../entities/customer-profile.entity';
import { User } from '../entities/user.entity';
import { UserStatus } from '../enums/user-status.enum';

const scrypt = promisify(scryptCallback);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: any) {
    const existed = await this.userRepo.findOne({ where: { email: dto.email } });

    if (existed) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await this.hashPassword(dto.password);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await this.dataSource.transaction(async (manager) => {
      const user = await manager.save(User, {
        email: dto.email,
        full_name: dto.full_name,
        phone: dto.phone ?? null,
        password_hash: passwordHash,
        role: UserRole.CUSTOMER,
        status: UserStatus.PENDING,
        auth_provider: 'local',
        otp_code: otpCode,
        otp_expires_at: new Date(Date.now() + 5 * 60 * 1000),
      });

      await manager.save(CustomerProfile, {
        user_id: user.id,
        birth_date: dto.birth_date ?? null,
        gender: dto.gender ?? null,
      });
    });

    return {
      success: true,
      data: {
        message: 'Register successful. Please verify OTP.',
        otp_code: otpCode,
      },
    };
  }

  async verifyOtp(dto: { email: string; otp_code: string }) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user || user.otp_code !== dto.otp_code) {
      throw new BadRequestException('OTP không hợp lệ');
    }

    if (!user.otp_expires_at || user.otp_expires_at < new Date()) {
      throw new BadRequestException('OTP đã hết hạn');
    }

    user.status = UserStatus.ACTIVE;
    user.otp_code = null;
    user.otp_expires_at = null;

    await this.userRepo.save(user);

    return {
      success: true,
      data: {
        message: 'Verify OTP successful',
      },
    };
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const valid = await this.verifyPassword(dto.password, user.password_hash);

    if (!valid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('Tài khoản chưa active hoặc đã bị khóa');
    }

    const tokens = await this.generateTokens(user);

    return {
      success: true,
      data: {
        message: 'Login successful',
        user: this.toSafeUser(user),
        ...tokens,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync<{ sub: string }>(refreshToken, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
    });

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    const refreshTokenHash = this.hashToken(refreshToken);

    if (!user || user.refreshToken !== refreshTokenHash) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    const tokens = await this.generateTokens(user);

    return {
      success: true,
      data: tokens,
    };
  }

  async logout(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (user) {
      user.refreshToken = null;
      await this.userRepo.save(user);
    }

    return {
      success: true,
      data: {
        message: 'Logout successful',
      },
    };
  }

  async validateToken(token?: string) {
    if (!token) {
      return { valid: false, userId: null };
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string; email?: string; role?: UserRole }>(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });

      return {
        valid: true,
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      return { valid: false, userId: null };
    }
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m') as any,
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d') as any,
    });

    user.refreshToken = this.hashToken(refresh_token);
    await this.userRepo.save(user);

    return { access_token, refresh_token };
  }

  private async hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

    return `scrypt$${salt}$${derivedKey.toString('hex')}`;
  }

  private async verifyPassword(password: string, passwordHash: string) {
    const [algorithm, salt, hash] = passwordHash.split('$');

    if (algorithm !== 'scrypt' || !salt || !hash) {
      return false;
    }

    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

    return derivedKey.toString('hex') === hash;
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private toSafeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      avatar_url: user.avatar_url,
      role: user.role,
      status: user.status,
    };
  }
}
