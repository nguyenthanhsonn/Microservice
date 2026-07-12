import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scrypt as scryptCallback } from 'crypto';
import { promisify } from 'util';
import { UserRole } from '@app/contracts';
import { DataSource, Repository } from 'typeorm';
import { CustomerProfile } from '../entities/customer-profile.entity';
import { StaffProfile } from '../entities/staff-profile.entity';
import { User } from '../entities/user.entity';
import { UserStatus } from '../enums/user-status.enum';

const scrypt = promisify(scryptCallback);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CustomerProfile)
    private readonly customerProfileRepository: Repository<CustomerProfile>,
    @InjectRepository(StaffProfile)
    private readonly staffProfileRepository: Repository<StaffProfile>,
    private readonly dataSource: DataSource,
  ) {}

  async getProfile(id: string) {
    const user = await this.findUserOrFail(id);

    const profile =
      user.role === UserRole.STAFF
        ? await this.staffProfileRepository.findOne({ where: { user_id: id } })
        : await this.customerProfileRepository.findOne({ where: { user_id: id } });

    return {
      success: true,
      data: {
        user: this.toSafeUser(user),
        profile,
      },
    };
  }

  async updateProfile(dto: any) {
    const user = await this.findUserOrFail(dto.id);

    user.full_name = dto.full_name ?? user.full_name;
    user.phone = dto.phone ?? user.phone;
    user.avatar_url = dto.avatar_url ?? user.avatar_url;

    await this.userRepository.save(user);

    if (user.role === UserRole.CUSTOMER) {
      const customerUpdates = this.pickDefined(dto, ['birth_date', 'gender']);

      if (Object.keys(customerUpdates).length > 0) {
        await this.customerProfileRepository.update({ user_id: user.id }, customerUpdates);
      }
    }

    if (user.role === UserRole.STAFF) {
      const staffUpdates = this.pickDefined(dto, [
        'job_title',
        'cinema_id',
        'shift_name',
        'shift_start',
        'shift_end',
      ]);

      if (Object.keys(staffUpdates).length > 0) {
        await this.staffProfileRepository.update({ user_id: user.id }, staffUpdates);
      }
    }

    return this.getProfile(user.id);
  }

  async getCustomers() {
    const profiles = await this.customerProfileRepository.find({
      relations: { user: true },
      order: { created_at: 'DESC' },
    });

    return {
      success: true,
      data: profiles.map((profile) => ({
        user: this.toSafeUser(profile.user),
        profile: this.withoutUserRelation(profile),
      })),
    };
  }

  async getStaffs() {
    const profiles = await this.staffProfileRepository.find({
      relations: { user: true },
      order: { created_at: 'DESC' },
    });

    return {
      success: true,
      data: profiles.map((profile) => ({
        user: this.toSafeUser(profile.user),
        profile: this.withoutUserRelation(profile),
      })),
    };
  }

  async createStaff(dto: any) {
    const existed = await this.userRepository.findOne({ where: { email: dto.email } });

    if (existed) {
      throw new BadRequestException('Email already exists');
    }

    const rawPassword = dto.password ?? randomBytes(8).toString('hex');
    const passwordHash = await this.hashPassword(rawPassword);

    const user = await this.dataSource.transaction(async (manager) => {
      const savedUser = await manager.save(User, {
        email: dto.email,
        full_name: dto.full_name,
        phone: dto.phone ?? null,
        password_hash: passwordHash,
        role: UserRole.STAFF,
        status: UserStatus.ACTIVE,
        auth_provider: 'local',
      });

      await manager.save(StaffProfile, {
        user_id: savedUser.id,
        employee_code: dto.employee_code,
        job_title: dto.job_title ?? null,
        cinema_id: dto.cinema_id ?? null,
        shift_name: dto.shift_name ?? null,
        shift_start: dto.shift_start ?? null,
        shift_end: dto.shift_end ?? null,
      });

      return savedUser;
    });

    return {
      success: true,
      data: {
        user: this.toSafeUser(user),
        generated_password: dto.password ? undefined : rawPassword,
      },
    };
  }

  async updateStatus(dto: { id: string; status: UserStatus }) {
    const user = await this.findUserOrFail(dto.id);

    if (!Object.values(UserStatus).includes(dto.status)) {
      throw new BadRequestException('Trạng thái không hợp lệ');
    }

    user.status = dto.status;
    await this.userRepository.save(user);

    return {
      success: true,
      data: this.toSafeUser(user),
    };
  }

  async resetStaffPassword(dto: { id: string; password?: string }) {
    const user = await this.findUserOrFail(dto.id);

    if (user.role !== UserRole.STAFF) {
      throw new BadRequestException('User không phải staff');
    }

    const rawPassword = dto.password ?? randomBytes(8).toString('hex');
    user.password_hash = await this.hashPassword(rawPassword);
    user.refreshToken = null;

    await this.userRepository.save(user);

    return {
      success: true,
      data: {
        message: 'Reset staff password successful',
        generated_password: dto.password ? undefined : rawPassword,
      },
    };
  }

  private async findUserOrFail(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    return user;
  }

  private async hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

    return `scrypt$${salt}$${derivedKey.toString('hex')}`;
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
      auth_provider: user.auth_provider,
      providerId: user.providerId,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  private withoutUserRelation<T extends { user?: User }>(profile: T) {
    const { user: _user, ...rest } = profile;

    return rest;
  }

  private pickDefined(source: Record<string, any>, keys: string[]) {
    return keys.reduce<Record<string, any>>((updates, key) => {
      if (source[key] !== undefined) {
        updates[key] = source[key];
      }

      return updates;
    }, {});
  }
}
