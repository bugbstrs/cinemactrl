import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theater } from '../../../backend/src/entities/theater.entity';
import { TheatersController } from './theaters.controller';
import { TheatersService } from './theaters.service';

@Module({
  imports: [TypeOrmModule.forFeature([Theater])],
  controllers: [TheatersController],
  providers: [TheatersService],
  exports: [TheatersService],
})
export class TheatersModule {}