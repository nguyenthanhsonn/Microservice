import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ShowtimeStatus } from '../enums/showtime-status.enum';

@Entity('showtimes')
export class Showtime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  movieId: string;

  @Column()
  cinemaId: string;

  @Column()
  roomId: string;

  @Column()
  screenName: string;

  @Column({ type: 'timestamptz' })
  startsAt: Date;

  @Column({ type: 'enum', enum: ShowtimeStatus, default: ShowtimeStatus.Scheduled })
  status: ShowtimeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
