import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Gender } from "../enums/gender.enum";
import { MembershipLevel } from "../enums/membership-level.enum";
import { User } from "./user.entity";

@Entity("customer_profiles")
export class CustomerProfile {
  @PrimaryColumn("uuid")
  user_id: string;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({
    type: "enum",
    enum: MembershipLevel,
    default: MembershipLevel.STANDARD,
  })
  membership_level: MembershipLevel;

  @Column({ type: "int", default: 0 })
  points: number;

  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
    default: "0",
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  total_spent: number;

  @Column({ type: "date", nullable: true })
  birth_date: string | null;

  @Column({ type: "enum", enum: Gender, nullable: true })
  gender: Gender | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
