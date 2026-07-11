import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateShowtimeDto } from '../dto/request/create-showtime.dto';
import { Room } from '../entities/room.entity';
import { Seat } from '../entities/seat.entity';
import { ShowtimeSeat } from '../entities/showtime-seat.entity';
import { Showtime } from '../entities/showtime.entity';
import {
  ScheduleType,
  ShowtimeSeatStatus,
  ShowtimeStatus,
} from '../enums/showtime.enum';

@Injectable()
export class ShowtimeService {
  private readonly lockDurationMs = 5 * 60 * 1000;

  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    @InjectRepository(ShowtimeSeat)
    private readonly showtimeSeatRepository: Repository<ShowtimeSeat>,
    private readonly dataSource: DataSource,
  ) {}

  async createShowtime(dto: CreateShowtimeDto) {
    return this.dataSource.transaction(async (manager) => {
      const room = await manager.findOne(Room, {
        where: { id: dto.room_id },
        relations: { cinema: true },
      });

      if (!room) {
        throw new NotFoundException('Không tìm thấy phòng');
      }

      const startTime = new Date(dto.start_time);
      const endTime = new Date(
        startTime.getTime() + (dto.movie_duration_minutes + 25) * 60 * 1000,
      );

      const showtime = manager.create(Showtime, {
        movie_id: dto.movie_id,
        movie_title: dto.movie_title,
        movie_duration_minutes: dto.movie_duration_minutes,
        cinema_id: room.cinema_id,
        room_id: room.id,
        show_date: dto.show_date,
        start_time: startTime,
        end_time: endTime,
        format: dto.format,
        base_price: dto.base_price,
        status: ShowtimeStatus.ON_SALE,
        schedule_type: ScheduleType.MANUAL,
      });

      const savedShowtime = await manager.save(Showtime, showtime);

      const seats = await manager.find(Seat, {
        where: { room_id: room.id, is_active: true },
      });

      if (seats.length === 0) {
        throw new BadRequestException('Phòng chưa có ghế');
      }

      const showtimeSeats = seats.map((seat) =>
        manager.create(ShowtimeSeat, {
          showtime_id: savedShowtime.id,
          seat_id: seat.id,
          price: dto.base_price + Number(seat.price_adjustment),
          status: ShowtimeSeatStatus.AVAILABLE,
          locked_by_user_id: null,
          lock_expires_at: null,
        }),
      );

      await manager.save(ShowtimeSeat, showtimeSeats);

      return {
        success: true,
        data: {
          showtime: savedShowtime,
          total_seats: showtimeSeats.length,
        },
      };
    });
  }

  async getShowtimeSeats(showtimeId: string) {
    const seats = await this.showtimeSeatRepository.find({
      where: { showtime_id: showtimeId },
      relations: { seat: true },
      order: {
        seat: {
          seat_row: 'ASC',
          seat_number: 'ASC',
        },
      },
    });

    return {
      success: true,
      data: seats,
    };
  }

  async lockSeats(userId: string, showtimeId: string, showtimeSeatIds: string[]) {
    if (!userId) {
      throw new BadRequestException('Yêu cầu đăng nhập');
    }

    return this.dataSource.transaction(async (manager) => {
      const seats = await manager
        .createQueryBuilder(ShowtimeSeat, 'ss')
        .setLock('pessimistic_write')
        .innerJoinAndSelect('ss.seat', 'seat')
        .where('ss.id IN (:...ids)', { ids: showtimeSeatIds })
        .andWhere('ss.showtime_id = :showtimeId', { showtimeId })
        .getMany();

      if (seats.length !== showtimeSeatIds.length) {
        throw new BadRequestException('Một số ghế không tồn tại');
      }

      const now = new Date();
      const expiresAt = new Date(Date.now() + this.lockDurationMs);

      for (const seat of seats) {
        const lockedByOtherUser =
          seat.status === ShowtimeSeatStatus.LOCKED &&
          seat.locked_by_user_id !== userId &&
          seat.lock_expires_at &&
          seat.lock_expires_at > now;

        const unavailable =
          seat.status === ShowtimeSeatStatus.SOLD ||
          seat.status === ShowtimeSeatStatus.RESERVED ||
          seat.status === ShowtimeSeatStatus.UNAVAILABLE;

        if (lockedByOtherUser || unavailable) {
          throw new BadRequestException(
            `Ghế ${seat.seat.seat_row}${seat.seat.seat_number} không khả dụng`,
          );
        }

        seat.status = ShowtimeSeatStatus.LOCKED;
        seat.locked_by_user_id = userId;
        seat.lock_expires_at = expiresAt;
      }

      await manager.save(ShowtimeSeat, seats);

      return {
        success: true,
        data: {
          message: 'Giữ ghế thành công',
          lock_expires_at: expiresAt,
          seats: seats.map((seat) => ({
            showtime_seat_id: seat.id,
            seat_id: seat.seat_id,
            seat_row: seat.seat.seat_row,
            seat_number: seat.seat.seat_number,
            price: seat.price,
          })),
        },
      };
    });
  }

  async validateLockedSeats(userId: string, showtimeId: string, showtimeSeatIds: string[]) {
    const showtime = await this.showtimeRepository.findOne({
      where: { id: showtimeId },
      relations: { cinema: true, room: true },
    });

    if (!showtime) {
      throw new NotFoundException('Không tìm thấy suất chiếu');
    }

    const seats = await this.showtimeSeatRepository.find({
      where: showtimeSeatIds.map((id) => ({ id, showtime_id: showtimeId })),
      relations: { seat: true },
    });

    if (seats.length !== showtimeSeatIds.length) {
      throw new BadRequestException('Một số ghế không thuộc suất chiếu này');
    }

    const now = new Date();

    for (const seat of seats) {
      const valid =
        seat.status === ShowtimeSeatStatus.LOCKED &&
        seat.locked_by_user_id === userId &&
        seat.lock_expires_at &&
        seat.lock_expires_at > now;

      if (!valid) {
        throw new BadRequestException(
          `Ghế ${seat.seat.seat_row}${seat.seat.seat_number} chưa được giữ bởi bạn hoặc đã hết hạn`,
        );
      }
    }

    return {
      showtime_id: showtime.id,
      movie_id: showtime.movie_id,
      movie_title: showtime.movie_title,
      cinema_id: showtime.cinema_id,
      cinema_name: showtime.cinema.name,
      room_id: showtime.room_id,
      room_name: showtime.room.name,
      show_date: showtime.show_date,
      start_time: this.toTimeString(showtime.start_time),
      end_time: this.toTimeString(showtime.end_time),
      format: showtime.format,
      seats: seats.map((seat) => ({
        showtime_seat_id: seat.id,
        seat_id: seat.seat_id,
        seat_row: seat.seat.seat_row,
        seat_number: seat.seat.seat_number,
        seat_type: seat.seat.type,
        price: seat.price,
      })),
    };
  }

  async releaseSeats(userId: string, showtimeId: string, showtimeSeatIds: string[]) {
    return this.dataSource.transaction(async (manager) => {
      const seats = await manager
        .createQueryBuilder(ShowtimeSeat, 'ss')
        .setLock('pessimistic_write')
        .where('ss.id IN (:...ids)', { ids: showtimeSeatIds })
        .andWhere('ss.showtime_id = :showtimeId', { showtimeId })
        .getMany();

      for (const seat of seats) {
        if (
          seat.status === ShowtimeSeatStatus.LOCKED &&
          seat.locked_by_user_id === userId
        ) {
          seat.status = ShowtimeSeatStatus.AVAILABLE;
          seat.locked_by_user_id = null;
          seat.lock_expires_at = null;
        }
      }

      await manager.save(ShowtimeSeat, seats);

      return {
        success: true,
        data: {
          message: 'Release ghế thành công',
        },
      };
    });
  }

  async markSeatsSold(userId: string, showtimeId: string, showtimeSeatIds: string[]) {
    return this.dataSource.transaction(async (manager) => {
      const seats = await manager
        .createQueryBuilder(ShowtimeSeat, 'ss')
        .setLock('pessimistic_write')
        .where('ss.id IN (:...ids)', { ids: showtimeSeatIds })
        .andWhere('ss.showtime_id = :showtimeId', { showtimeId })
        .getMany();

      if (seats.length !== showtimeSeatIds.length) {
        throw new BadRequestException('Một số ghế không tồn tại');
      }

      for (const seat of seats) {
        if (
          seat.status !== ShowtimeSeatStatus.LOCKED ||
          seat.locked_by_user_id !== userId
        ) {
          throw new BadRequestException('Ghế không hợp lệ để chuyển sang sold');
        }

        seat.status = ShowtimeSeatStatus.SOLD;
        seat.locked_by_user_id = null;
        seat.lock_expires_at = null;
      }

      await manager.save(ShowtimeSeat, seats);

      return {
        success: true,
        data: {
          message: 'Cập nhật ghế đã bán thành công',
        },
      };
    });
  }

  private toTimeString(date: Date) {
    return date.toISOString().slice(11, 19);
  }
}
