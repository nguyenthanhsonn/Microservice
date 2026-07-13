import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyTicketRequestDto {
  @IsString()
  @IsNotEmpty()
  qr_payload: string;
}
