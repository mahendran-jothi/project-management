import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  await app.listen(port || 3000);
  console.log(`Server listening on http://localhost:${port}`);
}
bootstrap();
