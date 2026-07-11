import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CINEMA_SHOWTIME_PATTERNS } from '@app/contracts';
import { CinemaService } from './cinema/cinema.service';
import { CreateRoomDto } from './dto/request/create-room.dto';
import { CreateShowtimeDto } from './dto/request/create-showtime.dto';
import { ShowtimeService } from './showtime/showtime.service';

@Controller()
export class CinemaShowtimeMessageController {
  constructor(
    private readonly cinemaService: CinemaService,
    private readonly showtimeService: ShowtimeService,
  ) {}

  @MessagePattern(CINEMA_SHOWTIME_PATTERNS.CREATE_ROOM)
  createRoom(@Payload() payload: CreateRoomDto) {
    return this.cinemaService.createRoom(payload);
  }

  @MessagePattern(CINEMA_SHOWTIME_PATTERNS.GENERATE_SEATS)
  generateSeats(@Payload() payload: { room_id: string }) {
    return this.cinemaService.generateSeats(payload.room_id);
  }

  @MessagePattern(CINEMA_SHOWTIME_PATTERNS.CREATE_SHOWTIME)
  createShowtime(@Payload() payload: CreateShowtimeDto) {
    return this.showtimeService.createShowtime(payload);
  }

  @MessagePattern(CINEMA_SHOWTIME_PATTERNS.GET_SHOWTIME_SEATS)
  getShowtimeSeats(@Payload() payload: { showtime_id: string }) {
    return this.showtimeService.getShowtimeSeats(payload.showtime_id);
  }

  @MessagePattern(CINEMA_SHOWTIME_PATTERNS.LOCK_SEATS)
  lockSeats(@Payload() payload: { userId: string; showtime_id: string; showtime_seat_ids: string[] }) {
    return this.showtimeService.lockSeats(payload.userId, payload.showtime_id, payload.showtime_seat_ids);
  }

  @MessagePattern(CINEMA_SHOWTIME_PATTERNS.RELEASE_SEATS)
  releaseSeats(@Payload() payload: { userId: string; showtime_id: string; showtime_seat_ids: string[] }) {
    return this.showtimeService.releaseSeats(payload.userId, payload.showtime_id, payload.showtime_seat_ids);
  }

  @MessagePattern(CINEMA_SHOWTIME_PATTERNS.VALIDATE_LOCKED_SEATS)
  validateLockedSeats(@Payload() payload: { userId: string; showtime_id: string; showtime_seat_ids: string[] }) {
    return this.showtimeService.validateLockedSeats(payload.userId, payload.showtime_id, payload.showtime_seat_ids);
  }

  @MessagePattern(CINEMA_SHOWTIME_PATTERNS.MARK_SEATS_SOLD)
  markSeatsSold(@Payload() payload: { userId: string; showtime_id: string; showtime_seat_ids: string[] }) {
    return this.showtimeService.markSeatsSold(payload.userId, payload.showtime_id, payload.showtime_seat_ids);
  }

  @MessagePattern(CINEMA_SHOWTIME_PATTERNS.RELEASE_BOOKING_SEATS)
  releaseBookingSeats(@Payload() payload: { userId: string; showtime_id: string; showtime_seat_ids: string[] }) {
    return this.showtimeService.releaseSeats(payload.userId, payload.showtime_id, payload.showtime_seat_ids);
  }
}
