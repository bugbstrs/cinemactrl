import { NestFactory } from '@nestjs/core';
import { BookingServiceModule } from './booking-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(BookingServiceModule);

  const config = new DocumentBuilder()
      .setTitle('Cinema Management API')
      .setDescription('API for Cinema Management')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
