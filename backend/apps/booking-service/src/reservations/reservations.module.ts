import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { JwtService } from '@nestjs/jwt';
import { Theater } from '../../../../shared/entities/theater.entity';
import { User } from 'shared/entities/user.entity';
import { Movie } from 'shared/entities/movie.entity';
import { Rating } from 'shared/entities/rating.entity';
import { Reservation } from 'shared/entities/reservation.entity';
import { AvailableShowing } from 'shared/entities/available-showing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Movie, Rating, Reservation, AvailableShowing, Theater])],
  controllers: [ReservationsController],
  providers: [ReservationsService, JwtService],
})
export class ReservationsModule {}