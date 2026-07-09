import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  SERVICE_NAME: Joi.string().default('cinepro-service'),
  PORT: Joi.number().default(3000),
  API_GATEWAY_PORT: Joi.number().default(3000),

  AUTH_USER_SERVICE_HOST: Joi.string().default('localhost'),
  AUTH_USER_SERVICE_PORT: Joi.number().port().default(3001),
  MOVIE_SERVICE_HOST: Joi.string().default('localhost'),
  MOVIE_SERVICE_PORT: Joi.number().port().default(3002),
  CINEMA_SHOWTIME_SERVICE_HOST: Joi.string().default('localhost'),
  CINEMA_SHOWTIME_SERVICE_PORT: Joi.number().port().default(3003),
  BOOKING_SERVICE_HOST: Joi.string().default('localhost'),
  BOOKING_SERVICE_PORT: Joi.number().port().default(3004),
  PAYMENT_SERVICE_HOST: Joi.string().default('localhost'),
  PAYMENT_SERVICE_PORT: Joi.number().port().default(3005),
  TICKET_SERVICE_HOST: Joi.string().default('localhost'),
  TICKET_SERVICE_PORT: Joi.number().port().default(3006),
  NOTIFICATION_SERVICE_HOST: Joi.string().default('localhost'),
  NOTIFICATION_SERVICE_PORT: Joi.number().port().default(3007),
  PRODUCT_SERVICE_HOST: Joi.string().default('localhost'),
  PRODUCT_SERVICE_PORT: Joi.number().port().default(3008),

  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().default('cinepro'),
  DB_PASSWORD: Joi.string().default('cinepro'),
  DB_DATABASE: Joi.string().default('cinepro'),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(false),

  JWT_SECRET: Joi.string().default('change-me'),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('', null),

  RABBITMQ_URL: Joi.string().default('amqp://localhost:5672'),
  RABBITMQ_QUEUE: Joi.string().optional(),
});
