import { TimestampedEntity } from '@app/common';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BookingStatus } from '../enums/booking-status.enum';
import { BookingProduct } from './booking-product.entity';
import { BookingSeat } from './booking-seat.entity';

const decimalTransformer = {
  to: (value: number) => value,
  from: (value: string) => Number(value),
};

@Entity('bookings')
export class Booking extends TimestampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 30 })
  booking_code: string;

  @Index()
  @Column({ type: 'uuid' })
  user_id: string;

  @Index()
  @Column({ type: 'uuid' })
  showtime_id: string;

  @Column({ type: 'uuid' })
  movie_id: string;

  @Column({ type: 'varchar', length: 255 })
  movie_title: string;

  @Column({ type: 'uuid' })
  cinema_id: string;

  @Column({ type: 'varchar', length: 160 })
  cinema_name: string;

  @Column({ type: 'uuid' })
  room_id: string;

  @Column({ type: 'varchar', length: 160 })
  room_name: string;

  @Column({ type: 'date' })
  show_date: string;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;

  @Column({ type: 'varchar', length: 50 })
  format: string;

  @Column({ type: 'varchar', length: 160 })
  customer_name: string;

  @Column({ type: 'varchar', length: 255 })
  customer_email: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  customer_phone: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '0',
    transformer: decimalTransformer,
  })
  seat_total_price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '0',
    transformer: decimalTransformer,
  })
  product_total_price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '0',
    transformer: decimalTransformer,
  })
  total_price: number;

  @Index()
  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: Date | null;

  @OneToMany(() => BookingSeat, (seat) => seat.booking)
  booking_seats: BookingSeat[];

  @OneToMany(() => BookingProduct, (product) => product.booking)
  booking_products: BookingProduct[];
}
