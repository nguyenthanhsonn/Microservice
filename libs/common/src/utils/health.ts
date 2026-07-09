import { HealthResponseDto } from '@app/contracts';

export const health = (service: string): HealthResponseDto => ({
  service,
  status: 'ok',
  timestamp: new Date().toISOString()
});
