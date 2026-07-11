import { TimestampedEntity } from '@app/common';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ShowtimeSeatStatus } from '../enums/showtime.enum';
import { Seat } from './seat.entity';
import { Showtime } from './showtime.entity';

@Entity('showtime_seats')
@Unique(['showtime_id', 'seat_id'])
export class ShowtimeSeat extends TimestampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  showtime_id: string;

  @ManyToOne(() => Showtime, (showtime) => showtime.showtime_seats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'showtime_id' })
  showtime: Showtime;

  @Index()
  @Column({ type: 'uuid' })
  seat_id: string;

  @ManyToOne(() => Seat, (seat) => seat.showtime_seats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @Column({
    type: 'enum',
    enum: ShowtimeSeatStatus,
    default: ShowtimeSeatStatus.AVAILABLE,
  })
  @Index()
  status: ShowtimeSeatStatus;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  locked_by_user_id: string | null;

  @Column({ type: 'timestamp', nullable: true })
  lock_expires_at: Date | null;
}
