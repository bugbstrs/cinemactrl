import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Rating } from '../../backend/src/entities/rating.entity';
import { Movie } from '../../backend/src/entities/movie.entity';
import { Theater } from '../../backend/src/entities/theater.entity';
import { AvailableShowing } from '../../booking-service/src/entities/available-showing.entity';
import { Reservation } from '../../booking-service/src/entities/reservation.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: parseInt(configService.get('DB_PORT', '5433'), 10),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_DATABASE', 'cinema'),
        entities: [User, Rating, Movie, Theater, AvailableShowing, Reservation],
        synchronize: true,
      }),
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}