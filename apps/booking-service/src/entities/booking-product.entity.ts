import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Booking } from './booking.entity';

const decimalTransformer = {
  to: (value: number) => value,
  from: (value: string) => Number(value),
};

@Entity('booking_products')
export class BookingProduct {
  @PrimaryColumn('uuid')
  booking_id: string;

  @PrimaryColumn('uuid')
  product_id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  category: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimalTransformer })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimalTransformer })
  total_price: number;

  @ManyToOne(() => Booking, (booking) => booking.booking_products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}
