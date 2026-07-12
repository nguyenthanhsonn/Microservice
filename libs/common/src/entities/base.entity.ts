import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class CreatedAtEntity {
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}

export abstract class TimestampedEntity extends CreatedAtEntity {
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

export abstract class BaseEntity extends TimestampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
