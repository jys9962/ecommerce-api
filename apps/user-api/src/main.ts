import { NestFactory } from '@nestjs/core';
import { UserApiModule } from './user-api.module';

async function bootstrap() {
  const app = await NestFactory.create(UserApiModule);
  await app.listen(3000);
}
bootstrap();
