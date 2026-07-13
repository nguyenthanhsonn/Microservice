import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { Booking } from './booking.entity';

const decimalTransformer = {
  to: (value: number) => value,
  from: (value: string) => Number(value),
};

@Entity('booking_seats')
@Unique(['booking_id', 'showtime_seat_id'])
export class BookingSeat {
  @PrimaryColumn('uuid')
  booking_id: string;

  @PrimaryColumn('uuid')
  showtime_seat_id: string;

  @Column({ type: 'uuid' })
  seat_id: string;

  @Column({ type: 'varchar', length: 10 })
  seat_row: string;

  @Column({ type: 'int' })
  seat_number: number;

  @Column({ type: 'varchar', length: 30 })
  seat_type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimalTransformer })
  unit_price: number;

  @ManyToOne(() => Booking, (booking) => booking.booking_seats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}
