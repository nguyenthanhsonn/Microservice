import { TimestampedEntity } from '@app/common';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  ScheduleType,
  ScreeningFormat,
  ShowtimeStatus,
} from '../enums/showtime.enum';
import { Cinema } from './cinema.entity';
import { Room } from './room.entity';
import { ShowtimeSeat } from './showtime-seat.entity';

@Entity('showtimes')
export class Showtime extends TimestampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  movie_id: string;

  @Column({ type: 'varchar', length: 255 })
  movie_title: string;

  @Column({ type: 'int' })
  movie_duration_minutes: number;

  @Index()
  @Column({ type: 'uuid' })
  cinema_id: string;

  @ManyToOne(() => Cinema, (cinema) => cinema.showtimes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cinema_id' })
  cinema: Cinema;

  @Index()
  @Column({ type: 'uuid' })
  room_id: string;

  @ManyToOne(() => Room, (room) => room.showtimes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Index()
  @Column({ type: 'date' })
  show_date: string;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @Column({ type: 'enum', enum: ScreeningFormat, default: ScreeningFormat.TWO_D })
  format: ScreeningFormat;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '0',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  base_price: number;

  @Column({ type: 'enum', enum: ShowtimeStatus, default: ShowtimeStatus.DRAFT })
  @Index()
  status: ShowtimeStatus;

  @Column({ type: 'enum', enum: ScheduleType, default: ScheduleType.MANUAL })
  @Index()
  schedule_type: ScheduleType;

  @OneToMany(() => ShowtimeSeat, (showtimeSeat) => showtimeSeat.showtime)
  showtime_seats: ShowtimeSeat[];
}
