import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CINEMA_SHOWTIME_PATTERNS,
  PRODUCT_PATTERNS,
  SERVICE_NAMES,
} from '@app/contracts';
import { firstValueFrom } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { CreateBookingRequestDto } from './dto/request/create-booking.request.dto';
import { GetMyBookingsRequestDto } from './dto/request/get-my-bookings.request.dto';
import { BookingProduct } from './entities/booking-product.entity';
import { BookingSeat } from './entities/booking-seat.entity';
import { Booking } from './entities/booking.entity';
import { BookingStatus } from './enums/booking-status.enum';

type SeatSnapshot = {
  showtime_seat_id: string;
  seat_id: string;
  seat_row: string;
  seat_number: number;
  seat_type: string;
  price: number;
};

type ShowtimeSnapshot = {
  showtime_id: string;
  movie_id: string;
  movie_title: string;
  cinema_id: string;
  cinema_name: string;
  room_id: string;
  room_name: string;
  show_date: string;
  start_time: string;
  end_time: string;
  format: string;
  seats: SeatSnapshot[];
};

type ProductSnapshot = {
  product_id: string;
  name: string;
  category: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    private readonly dataSource: DataSource,
    @Inject(SERVICE_NAMES.CINEMA_SHOWTIME)
    private readonly cinemaShowtimeClient: ClientProxy,
    @Inject(SERVICE_NAMES.PRODUCT)
    private readonly productClient: ClientProxy,
  ) {}

  async create(userId: string, dto: CreateBookingRequestDto) {
    if (!userId) {
      throw new BadRequestException('Yêu cầu đăng nhập');
    }

    const showtimeSnapshot = await firstValueFrom(
      this.cinemaShowtimeClient.send<ShowtimeSnapshot>(
        CINEMA_SHOWTIME_PATTERNS.VALIDATE_LOCKED_SEATS,
        {
          userId,
          showtime_id: dto.showtime_id,
          showtime_seat_ids: dto.showtime_seat_ids,
        },
      ),
    );

    const productSnapshot = dto.products?.length
      ? await firstValueFrom(
          this.productClient.send<ProductSnapshot[]>(
            PRODUCT_PATTERNS.VALIDATE_BOOKING_PRODUCTS,
            { products: dto.products },
          ),
        )
      : [];

    const seatTotal = showtimeSnapshot.seats.reduce(
      (sum, seat) => sum + Number(seat.price),
      0,
    );
    const productTotal = productSnapshot.reduce(
      (sum, product) => sum + Number(product.total_price),
      0,
    );
    const totalPrice = seatTotal + productTotal;

    const booking = await this.dataSource.transaction(async (manager) => {
      const savedBooking = await manager.save(Booking, {
        booking_code: this.generateBookingCode(),
        user_id: userId,
        showtime_id: showtimeSnapshot.showtime_id,
        movie_id: showtimeSnapshot.movie_id,
        movie_title: showtimeSnapshot.movie_title,
        cinema_id: showtimeSnapshot.cinema_id,
        cinema_name: showtimeSnapshot.cinema_name,
        room_id: showtimeSnapshot.room_id,
        room_name: showtimeSnapshot.room_name,
        show_date: showtimeSnapshot.show_date,
        start_time: showtimeSnapshot.start_time,
        end_time: showtimeSnapshot.end_time,
        format: showtimeSnapshot.format,
        customer_name: dto.customer_name,
        customer_email: dto.customer_email,
        customer_phone: dto.customer_phone ?? null,
        seat_total_price: seatTotal,
        product_total_price: productTotal,
        total_price: totalPrice,
        status: BookingStatus.PENDING,
        notes: dto.notes ?? null,
        paid_at: null,
        cancelled_at: null,
      });

      await manager.save(
        BookingSeat,
        showtimeSnapshot.seats.map((seat) => ({
          booking_id: savedBooking.id,
          showtime_seat_id: seat.showtime_seat_id,
          seat_id: seat.seat_id,
          seat_row: seat.seat_row,
          seat_number: seat.seat_number,
          seat_type: seat.seat_type,
          unit_price: seat.price,
        })),
      );

      if (productSnapshot.length) {
        await manager.save(
          BookingProduct,
          productSnapshot.map((product) => ({
            booking_id: savedBooking.id,
            product_id: product.product_id,
            name: product.name,
            category: product.category,
            quantity: product.quantity,
            unit_price: product.unit_price,
            total_price: product.total_price,
          })),
        );
      }

      return savedBooking;
    });

    return {
      success: true,
      data: {
        message: 'Tạo booking thành công',
        booking: await this.findBookingDtoById(booking.id),
      },
    };
  }

  async findMyBookings(query: GetMyBookingsRequestDto) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.max(Number(query.limit ?? 10), 1);

    const [bookings, total] = await this.bookingRepo.findAndCount({
      where: { user_id: query.userId },
      relations: { booking_seats: true, booking_products: true },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      data: {
        bookings: bookings.map((booking) => this.toBookingDto(booking)),
        total,
        page,
        limit,
      },
    };
  }

  async findByIdForUser(userId: string, bookingId: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: { booking_seats: true, booking_products: true },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking');
    }

    if (booking.user_id !== userId) {
      throw new ForbiddenException('Không có quyền xem booking này');
    }

    return {
      success: true,
      data: {
        booking: this.toBookingDto(booking),
      },
    };
  }

  async findByCode(bookingCode: string) {
    const code = bookingCode?.trim();

    if (!code || code.length > 30 || !/^[\w-]+$/.test(code)) {
      throw new BadRequestException('Mã booking không hợp lệ');
    }

    const booking = await this.bookingRepo.findOne({
      where: { booking_code: code },
      relations: { booking_seats: true, booking_products: true },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking');
    }

    return {
      success: true,
      data: {
        booking: this.toBookingDto(booking),
      },
    };
  }

  async cancel(userId: string, bookingId: string) {
    const booking = await this.dataSource.transaction(async (manager) => {
      const current = await manager.findOne(Booking, {
        where: { id: bookingId },
        relations: { booking_seats: true, booking_products: true },
        lock: { mode: 'pessimistic_write' },
      });

      if (!current) {
        throw new NotFoundException('Không tìm thấy booking');
      }

      if (current.user_id !== userId) {
        throw new ForbiddenException('Không có quyền hủy booking này');
      }

      if (current.status !== BookingStatus.PENDING) {
        throw new BadRequestException('Chỉ có thể hủy booking đang chờ thanh toán');
      }

      current.status = BookingStatus.CANCELLED;
      current.cancelled_at = new Date();

      return manager.save(Booking, current);
    });

    await firstValueFrom(
      this.cinemaShowtimeClient.send(CINEMA_SHOWTIME_PATTERNS.RELEASE_BOOKING_SEATS, {
        userId,
        showtime_id: booking.showtime_id,
        showtime_seat_ids: booking.booking_seats.map((seat) => seat.showtime_seat_id),
      }),
    );

    return {
      success: true,
      data: {
        message: 'Hủy booking thành công',
        booking_id: booking.id,
        status: booking.status,
      },
    };
  }

  async markPaid(bookingId: string) {
    const booking = await this.dataSource.transaction(async (manager) => {
      const current = await manager.findOne(Booking, {
        where: { id: bookingId },
        relations: { booking_seats: true, booking_products: true },
        lock: { mode: 'pessimistic_write' },
      });

      if (!current) {
        throw new NotFoundException('Không tìm thấy booking');
      }

      if (current.status === BookingStatus.PAID) {
        return current;
      }

      if (current.status !== BookingStatus.PENDING) {
        throw new BadRequestException('Chỉ booking pending mới được chuyển paid');
      }

      current.status = BookingStatus.PAID;
      current.paid_at = new Date();

      return manager.save(Booking, current);
    });

    await firstValueFrom(
      this.cinemaShowtimeClient.send(CINEMA_SHOWTIME_PATTERNS.MARK_SEATS_SOLD, {
        userId: booking.user_id,
        showtime_id: booking.showtime_id,
        showtime_seat_ids: booking.booking_seats.map((seat) => seat.showtime_seat_id),
      }),
    );

    return {
      success: true,
      data: {
        booking: this.toBookingDto(booking),
      },
    };
  }

  private async findBookingDtoById(id: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: { booking_seats: true, booking_products: true },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking');
    }

    return this.toBookingDto(booking);
  }

  private toBookingDto(booking: Booking) {
    return {
      id: booking.id,
      booking_code: booking.booking_code,
      user_id: booking.user_id,
      status: booking.status,
      movie: {
        id: booking.movie_id,
        title: booking.movie_title,
      },
      cinema: {
        id: booking.cinema_id,
        name: booking.cinema_name,
      },
      room: {
        id: booking.room_id,
        name: booking.room_name,
      },
      showtime: {
        id: booking.showtime_id,
        show_date: booking.show_date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        format: booking.format,
      },
      customer: {
        name: booking.customer_name,
        email: booking.customer_email,
        phone: booking.customer_phone,
      },
      seats: (booking.booking_seats ?? []).map((seat) => ({
        showtime_seat_id: seat.showtime_seat_id,
        seat_id: seat.seat_id,
        seat_row: seat.seat_row,
        seat_number: seat.seat_number,
        seat_type: seat.seat_type,
        unit_price: Number(seat.unit_price),
      })),
      products: (booking.booking_products ?? []).map((product) => ({
        product_id: product.product_id,
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        unit_price: Number(product.unit_price),
        total_price: Number(product.total_price),
      })),
      seat_total_price: Number(booking.seat_total_price),
      product_total_price: Number(booking.product_total_price),
      total_price: Number(booking.total_price),
      created_at: booking.created_at,
      paid_at: booking.paid_at,
      cancelled_at: booking.cancelled_at,
    };
  }

  private generateBookingCode() {
    return `CNM${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
  }
}
