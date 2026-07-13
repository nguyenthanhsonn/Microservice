import { TimestampedEntity } from '@app/common';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentProvider, PaymentStatus } from '../enums/payment.enum';

@Entity('payments')
export class Payment extends TimestampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  booking_id: string;

  @Column({ type: 'varchar', length: 30 })
  booking_code: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentProvider, default: PaymentProvider.MOCK })
  provider: PaymentProvider;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  @Index()
  status: PaymentStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_link_id: string | null;

  @Column({ type: 'text', nullable: true })
  checkout_url: string | null;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  failed_at: Date | null;
}
