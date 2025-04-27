import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../entities/user.entity';
import { Movie } from '../entities/movie.entity';
import { Theater } from '../entities/theater.entity';
import { AvailableShowing } from '../entities/available-showing.entity';
import { Rating } from '../entities/rating.entity';
import { Reservation } from '../entities/reservation.entity';

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
    TypeOrmModule.forFeature([
      User,
      Movie,
      Theater,
      AvailableShowing,
      Rating,
      Reservation,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}