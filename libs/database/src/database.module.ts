import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseConfig } from '@app/config';
import { DatabaseConnectionLogger } from './database-connection.logger';
import { createTypeOrmOptions } from './typeorm-options.factory';

@Module({})
export class DatabaseModule {
  static forRoot(
    entities: TypeOrmModuleOptions['entities'],
  ): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        ConfigModule.forFeature(databaseConfig),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) =>
            createTypeOrmOptions(configService, entities),
        }),
        TypeOrmModule.forFeature(entities as Function[]),
      ],
      providers: [DatabaseConnectionLogger],
      exports: [TypeOrmModule],
    };
  }

  static forFeature(entities: TypeOrmModuleOptions['entities']): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [TypeOrmModule.forFeature(entities as Function[])],
      exports: [TypeOrmModule],
    };
  }
}
