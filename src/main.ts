import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = await app.get(ConfigService);
  const PORT = config.get<number>('API_PORT') || 3000;

  await app.listen(PORT, () => {
    console.log(`App started on port ${PORT}`);
  });
}

bootstrap();
