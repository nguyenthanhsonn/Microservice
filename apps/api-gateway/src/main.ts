import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = Number(process.env.API_GATEWAY_PORT ?? 3000);
  await app.listen(port);

  console.log(`API Gateway is running on http://localhost:${port}/api/v1`);
}

bootstrap();