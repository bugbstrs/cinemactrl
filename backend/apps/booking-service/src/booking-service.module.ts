import { Module } from '@nestjs/common';
import { BookingServiceController } from './booking-service.controller';
import { BookingServiceService } from './booking-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.CINEMACTRL_DB_HOST ?? 'localhost',
      port: parseInt(process.env.CINEMACTRL_DB_PORT ?? "5432", 10),
      username: process.env.CINEMACTRL_DB_USER ?? 'user',
      password: process.env.CINEMACTRL_DB_PASSWORD ?? 'password',
      database: process.env.CINEMACTRL_DB_DATABASE ?? 'appdb',
      entities: [Booking],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Booking]),
  ],
  controllers: [BookingServiceController],
  providers: [BookingServiceService],
})
export class BookingServiceModule {}
