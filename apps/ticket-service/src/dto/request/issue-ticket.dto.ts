import { IsNotEmpty, IsString } from 'class-validator';

export class IssueTicketDto {
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
