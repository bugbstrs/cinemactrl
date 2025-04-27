import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../../../shared/entities/movie.entity';
import { Rating } from '../../../shared/entities/rating.entity';
import { Theater } from '../../../shared/entities/theater.entity';
import { User } from 'shared/entities/user.entity';
import { Reservation } from 'shared/entities/reservation.entity';
import { AvailableShowing } from 'shared/entities/available-showing.entity';
import { ProxyModule } from './proxy/proxy.module';

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
    ProxyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}