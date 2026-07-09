import { Injectable } from '@nestjs/common';

@Injectable()
export class QrService {
  createPayload(bookingId: string, userId: string) {
    return Buffer.from(JSON.stringify({ bookingId, userId, issuedAt: new Date().toISOString() })).toString('base64url');
  }
}
