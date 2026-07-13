import { IsNotEmpty, IsUUID } from 'class-validator';

export class CheckInTicketRequestDto {
  @IsUUID()
  @IsNotEmpty()
  ticketId: string;

  @IsUUID()
  @IsNotEmpty()
  staffId: string;
}
