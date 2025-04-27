import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowingsController } from './showings.controller';
import { ShowingsService } from './showings.service';
import { JwtService } from '@nestjs/jwt';
import { Theater } from '../../../../shared/entities/theater.entity';
import { User } from 'shared/entities/user.entity';
import { Movie } from 'shared/entities/movie.entity';
import { Rating } from 'shared/entities/rating.entity';
import { Reservation } from 'shared/entities/reservation.entity';
import { AvailableShowing } from 'shared/entities/available-showing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Movie, Rating, Reservation, AvailableShowing, Theater])],
  controllers: [ShowingsController],
  providers: [ShowingsService, JwtService],
  exports: [ShowingsService],
})
export class ShowingsModule {}