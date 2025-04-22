import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailableShowing } from '../../../booking-service/src/entities/available-showing.entity';
import { Movie } from '../../../backend/src/entities/movie.entity';
import { Theater } from '../../../backend/src/entities/theater.entity';
import { ShowingsController } from './showings.controller';
import { ShowingsService } from './showings.service';

@Module({
  imports: [TypeOrmModule.forFeature([AvailableShowing, Movie, Theater])],
  controllers: [ShowingsController],
  providers: [ShowingsService],
  exports: [ShowingsService],
})
export class ShowingsModule {}