import { TimestampedEntity } from '@app/common';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CinemaStatus } from '../enums/cinema.enum';
import { Room } from './room.entity';
import { Showtime } from './showtime.entity';

@Entity('cinemas')
export class Cinema extends TimestampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Index()
  @Column({ type: 'varchar', length: 100, nullable: true })
  province: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  hotline: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string | null;

  @Column({ type: 'enum', enum: CinemaStatus, default: CinemaStatus.ACTIVE })
  @Index()
  status: CinemaStatus;

  @OneToMany(() => Room, (room) => room.cinema)
  rooms: Room[];

  @OneToMany(() => Showtime, (showtime) => showtime.cinema)
  showtimes: Showtime[];
}
