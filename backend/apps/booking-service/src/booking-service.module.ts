import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsModule } from './reservations/reservations.module';
import { ShowingsModule } from './showings/showings.module';
import { TheatersModule } from './theaters/theaters.module';
import { MoviesModule } from './movies/movies.module';
import { User } from 'shared/entities/user.entity';
import { Movie } from 'shared/entities/movie.entity';
import { Rating } from 'shared/entities/rating.entity';
import { Reservation } from 'shared/entities/reservation.entity';
import { AvailableShowing } from 'shared/entities/available-showing.entity';
import { Theater } from 'shared/entities/theater.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.CINEMACTRL_DB_HOST ?? 'localhost',
      port: parseInt(process.env.CINEMACTRL_DB_PORT ?? "5432", 10),
      username: process.env.CINEMACTRL_DB_USER ?? 'user',
      password: process.env.CINEMACTRL_DB_PASSWORD ?? 'password',
      database: process.env.CINEMACTRL_DB_DATABASE ?? 'appdb',
      entities: [User, Movie, Rating, Reservation, AvailableShowing, Theater],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Movie, Rating, Reservation, AvailableShowing, Theater]),
    ReservationsModule,
    ShowingsModule,
    TheatersModule,
    MoviesModule
  ],
  controllers: [],
  providers: [],
})
export class BookingServiceModule {}
