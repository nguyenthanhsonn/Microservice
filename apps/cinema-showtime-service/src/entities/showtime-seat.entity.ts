import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('showtime_seats')
export class ShowtimeSeat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  showtimeId: string;

  @Column()
  seatId: string;

  @Column()
  seatCode: string;

  @Column({ default: 'available' })
  status: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  price: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
