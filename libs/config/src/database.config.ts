export const databaseConfig = () => ({
  database: {
    host: process.env.DB_HOST ?? process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? process.env.POSTGRES_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? process.env.POSTGRES_USER ?? 'cinepro',
    password: process.env.DB_PASSWORD ?? process.env.POSTGRES_PASSWORD ?? 'cinepro',
    name: process.env.DB_DATABASE ?? process.env.POSTGRES_DB ?? 'cinepro',
    synchronize: (process.env.DB_SYNCHRONIZE ?? process.env.TYPEORM_SYNCHRONIZE) === 'true',
    logging: (process.env.DB_LOGGING ?? process.env.TYPEORM_LOGGING) === 'true',
  },
});
