import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../../../booking-service/src/entities/reservation.entity';
import { AvailableShowing } from '../../../booking-service/src/entities/available-showing.entity';
import { Theater } from '../../../backend/src/entities/theater.entity';
import { User } from '../entities/user.entity';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, AvailableShowing, Theater, User])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}