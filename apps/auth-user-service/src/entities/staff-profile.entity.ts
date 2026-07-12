import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity("staff_profiles")
export class StaffProfile {
  @PrimaryColumn("uuid")
  user_id: string;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 50 })
  employee_code: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  job_title: string | null;

  @Index()
  @Column({ type: "uuid", nullable: true })
  cinema_id: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  shift_name: string | null;

  @Column({ type: "time", nullable: true })
  shift_start: string | null;

  @Column({ type: "time", nullable: true })
  shift_end: string | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
