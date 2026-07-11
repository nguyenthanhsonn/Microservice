import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoomDto } from '../dto/request/create-room.dto';
import { Cinema } from '../entities/cinema.entity';
import { Room } from '../entities/room.entity';
import { Seat } from '../entities/seat.entity';
import { RoomStatus, SeatType } from '../enums/cinema.enum';

@Injectable()
export class CinemaService {
  constructor(
    @InjectRepository(Cinema)
    private readonly cinemaRepository: Repository<Cinema>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  async createRoom(dto: CreateRoomDto) {
    const cinema = await this.cinemaRepository.findOne({
      where: { id: dto.cinema_id },
    });

    if (!cinema) {
      throw new NotFoundException('Không tìm thấy rạp');
    }

    const room = this.roomRepository.create({
      cinema_id: dto.cinema_id,
      name: dto.name,
      format: dto.format,
      total_rows: dto.total_rows,
      total_columns: dto.total_columns,
      total_seats: dto.total_rows * dto.total_columns,
      status: RoomStatus.ACTIVE,
    });

    const savedRoom = await this.roomRepository.save(room);

    return {
      success: true,
      data: savedRoom,
    };
  }

  async generateSeats(roomId: string) {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Không tìm thấy phòng');
    }

    const existingSeats = await this.seatRepository.count({
      where: { room_id: roomId },
    });

    if (existingSeats > 0) {
      throw new BadRequestException('Phòng này đã được sinh ghế');
    }

    const seats: Seat[] = [];

    for (let rowIndex = 0; rowIndex < room.total_rows; rowIndex++) {
      const seatRow = String.fromCharCode(65 + rowIndex);

      for (let seatNumber = 1; seatNumber <= room.total_columns; seatNumber++) {
        const isLastRow = rowIndex === room.total_rows - 1;
        const isVipRow = rowIndex >= Math.floor(room.total_rows / 3);

        const type = isLastRow
          ? SeatType.COUPLE
          : isVipRow
            ? SeatType.VIP
            : SeatType.STANDARD;

        const priceAdjustment =
          type === SeatType.COUPLE ? '95000' : type === SeatType.VIP ? '30000' : '0';

        seats.push(
          this.seatRepository.create({
            room_id: room.id,
            seat_row: seatRow,
            seat_number: seatNumber,
            type,
            price_adjustment: priceAdjustment,
            is_active: true,
          }),
        );
      }
    }

    const savedSeats = await this.seatRepository.save(seats);

    return {
      success: true,
      data: {
        message: 'Sinh ghế thành công',
        total: savedSeats.length,
        seats: savedSeats,
      },
    };
  }
}
