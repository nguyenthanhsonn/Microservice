import { UserRole } from "@app/contracts";
import { BaseEntity } from "@app/database";
import { Column, Entity, Index } from "typeorm";
import { UserStatus } from "../enums/user-status.enum";

@Entity("users")
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  password_hash: string | null;

  @Column({ type: "varchar", length: 160 })
  full_name: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 30, nullable: true })
  phone: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  avatar_url: string | null;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ type: "varchar", length: 20, default: "local" })
  auth_provider: "local" | "google";

  @Index()
  @Column({ type: "varchar", length: 255, name: "provider_id", nullable: true })
  providerId: string | null;

  @Column({ type: "varchar", name: "refresh_token", nullable: true })
  refreshToken: string | null;

  @Column({ type: "varchar", nullable: true })
  otp_code: string | null;

  @Column({ type: "timestamp", nullable: true })
  otp_expires_at: Date | null;

  @Column({
    type: "varchar",
    name: "password_reset_token_hash",
    nullable: true,
  })
  passwordResetTokenHash: string | null;

  @Column({
    type: "timestamp",
    name: "password_reset_token_expires_at",
    nullable: true,
  })
  passwordResetTokenExpiresAt: Date | null;
}
