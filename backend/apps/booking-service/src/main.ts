import { NestFactory } from '@nestjs/core';
import { BookingServiceModule } from './booking-service.module';

async function bootstrap() {
  const app = await NestFactory.create(BookingServiceModule);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
