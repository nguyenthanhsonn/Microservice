import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseConnectionLogger implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseConnectionLogger.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  onApplicationBootstrap() {
    const host = this.configService.get<string>('database.host');
    const port = this.configService.get<number>('database.port');
    const database = this.configService.get<string>('database.name');

    if (!this.dataSource.isInitialized) {
      this.logger.warn(`PostgreSQL connection is not initialized: ${host}:${port}/${database}`);
      return;
    }

    this.logger.log(
      `PostgreSQL connected: ${host}:${port}/${database} (${this.dataSource.entityMetadatas.length} entities)`,
    );
  }
}
