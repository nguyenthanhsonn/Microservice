import { TimestampedEntity } from '@app/common';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { TicketStatus } from '../enums/ticket.enum';

@Entity('tickets')
export class Ticket extends TimestampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 40 })
  ticket_code: string;

  @Index()
  @Column({ type: 'uuid' })
  booking_id: string;

  @Column({ type: 'varchar', length: 30 })
  booking_code: string;

  @Index()
  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  movie_title: string;

  @Column({ type: 'varchar', length: 160 })
  cinema_name: string;

  @Column({ type: 'varchar', length: 160 })
  room_name: string;

  @Column({ type: 'date' })
  show_date: string;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'text' })
  seat_labels: string;

  @Column({ type: 'text' })
  qr_payload: string;

  @Column({ type: 'text', nullable: true })
  qr_code_url: string | null;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.VALID })
  @Index()
  status: TicketStatus;

  @Column({ type: 'timestamp', nullable: true })
  checked_in_at: Date | null;

  @Column({ type: 'uuid', nullable: true })
  checked_in_by: string | null;
}
