import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const createTypeOrmOptions = (
  configService: ConfigService,
  entities: TypeOrmModuleOptions['entities'],
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.getOrThrow<string>('database.host'),
  port: configService.getOrThrow<number>('database.port'),
  username: configService.getOrThrow<string>('database.username'),
  password: configService.getOrThrow<string>('database.password'),
  database: configService.getOrThrow<string>('database.name'),
  entities,
  synchronize: configService.get<boolean>('database.synchronize') ?? false,
  logging: configService.get<boolean>('database.logging') ?? false,
});