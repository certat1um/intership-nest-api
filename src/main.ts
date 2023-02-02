import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.APP_PORT || 3000;
  const HOST = process.env.APP_HOST || 'localhost';

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(PORT, HOST, () => {
    console.log(`App started on port ${HOST}:${PORT}`);
  });
}

bootstrap();
