import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = await app.get(ConfigService);
  const HOST = config.get<string>('APP_HOST') || 'localhost';
  const PORT = config.get<number>('APP_PORT') || 3000;

  await app.listen(PORT, HOST, () => {
    console.log(`App started on port ${HOST}:${PORT}`);
  });
}

bootstrap();
