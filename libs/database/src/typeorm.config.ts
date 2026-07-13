import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import { databaseConfig } from '@app/config';

const { database } = databaseConfig();

export default new DataSource({
  type: 'postgres',
  host: database.host,
  port: database.port,
  username: database.username,
  password: database.password,
  database: database.name,
  entities: ['apps/**/*.entity.ts'],
  migrations: ['libs/database/src/migrations/*.ts'],
  synchronize: false
});
