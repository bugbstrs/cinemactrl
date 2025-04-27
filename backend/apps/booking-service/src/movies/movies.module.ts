import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Theater } from '../../../../shared/entities/theater.entity';
import { User } from 'shared/entities/user.entity';
import { Movie } from 'shared/entities/movie.entity';
import { Rating } from 'shared/entities/rating.entity';
import { Reservation } from 'shared/entities/reservation.entity';
import { AvailableShowing } from 'shared/entities/available-showing.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Movie, Rating, Reservation, AvailableShowing, Theater])],
  controllers: [MoviesController],
  providers: [MoviesService, JwtService],
  exports: [MoviesService],
})
export class MoviesModule {}