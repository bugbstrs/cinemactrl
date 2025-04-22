import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailableShowing } from '../../../booking-service/src/entities/available-showing.entity';
import { Movie } from '../../../backend/src/entities/movie.entity';
import { Theater } from '../../../backend/src/entities/theater.entity';
import { CreateShowingDto } from './dto/create-showing.dto';
import { UpdateShowingDto } from './dto/update-showing.dto';

@Injectable()
export class ShowingsService {
  constructor(
    @InjectRepository(AvailableShowing)
    private showingsRepository: Repository<AvailableShowing>,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(Theater)
    private theatersRepository: Repository<Theater>,
  ) {}

  async findAll(): Promise<any[]> {
    const showings = await this.showingsRepository.find({
      relations: ['movie', 'theater'],
    });

    return showings.map(showing => ({
      id: showing.id,
      theaterId: showing.theater.id,
      movieId: showing.movie.id,
      startTime: showing.startTime,
      theaterName: showing.theater.name,
      movieName: showing.movie.name,
    }));
  }

  async findOne(id: number): Promise<any> {
    const showing = await this.showingsRepository.findOne({
      where: { id },
      relations: ['movie', 'theater'],
    });

    if (!showing) {
      throw new NotFoundException(`Available Showing with ID ${id} not found`);
    }

    return {
      id: showing.id,
      theaterId: showing.theater.id,
      movieId: showing.movie.id,
      startTime: showing.startTime,
      theaterName: showing.theater.name,
      movieName: showing.movie.name,
    };
  }

  private getTimeFromDate(date: Date): { hours: number; minutes: number } {
    return {
      hours: date.getHours(),
      minutes: date.getMinutes()
    };
  }

  private async checkTimeOverlap(
    theaterId: number, 
    startTime: Date, 
    movieDuration: number, 
    excludeShowingId?: number
  ): Promise<boolean> {
    const theaterShowings = await this.showingsRepository.find({
      where: { theater: { id: theaterId } },
      relations: ['movie'],
    });
    
    const newShowingTime = this.getTimeFromDate(startTime);
    
    const newShowingStartMinutes = newShowingTime.hours * 60 + newShowingTime.minutes;
    const newShowingEndMinutes = newShowingStartMinutes + movieDuration;
    
    for (const showing of theaterShowings) {
      if (excludeShowingId && showing.id === excludeShowingId) {
        continue;
      }
      
      const existingTime = this.getTimeFromDate(showing.startTime);
      const existingStartMinutes = existingTime.hours * 60 + existingTime.minutes;
      const existingEndMinutes = existingStartMinutes + showing.movie.duration;
      
      if (
        (newShowingStartMinutes >= existingStartMinutes && newShowingStartMinutes < existingEndMinutes) ||
        (newShowingEndMinutes > existingStartMinutes && newShowingEndMinutes <= existingEndMinutes) ||
        (newShowingStartMinutes <= existingStartMinutes && newShowingEndMinutes >= existingEndMinutes)
      ) {
        return true;
      }
    }
    
    return false;
  }

  async create(createShowingDto: CreateShowingDto): Promise<any> {
    const { theaterId, movieId, startTime } = createShowingDto;

    const movie = await this.moviesRepository.findOne({ where: { id: movieId } });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    const theater = await this.theatersRepository.findOne({ where: { id: theaterId } });
    if (!theater) {
      throw new NotFoundException(`Theater with ID ${theaterId} not found`);
    }
    
    const showingTime = new Date(startTime);
    
    const hasOverlap = await this.checkTimeOverlap(theaterId, showingTime, movie.duration);
    if (hasOverlap) {
      throw new BadRequestException(`Time slot overlaps with existing showing for this theater`);
    }

    const standardTime = new Date();
    standardTime.setHours(showingTime.getHours(), showingTime.getMinutes(), 0, 0);
    
    const showing = this.showingsRepository.create({
      movie: { id: movieId },
      theater: { id: theaterId },
      startTime: standardTime,
    });

    const savedShowing = await this.showingsRepository.save(showing);
    
    return {
      id: savedShowing.id,
      theaterId,
      movieId,
      startTime: savedShowing.startTime,
    };
  }

  async update(id: number, updateShowingDto: UpdateShowingDto): Promise<any> {
    const showing = await this.showingsRepository.findOne({
      where: { id },
      relations: ['movie', 'theater'],
    });

    if (!showing) {
      throw new NotFoundException(`Available Showing with ID ${id} not found`);
    }

    let movieToUse = showing.movie;
    let theaterIdToUse = showing.theater.id;
    let startTimeToUse = showing.startTime;

    if (updateShowingDto.movieId) {
      const movie = await this.moviesRepository.findOne({ where: { id: updateShowingDto.movieId } });
      if (!movie) {
        throw new NotFoundException(`Movie with ID ${updateShowingDto.movieId} not found`);
      }
      showing.movie = movie;
      movieToUse = movie;
    }

    if (updateShowingDto.theaterId) {
      const theater = await this.theatersRepository.findOne({ where: { id: updateShowingDto.theaterId } });
      if (!theater) {
        throw new NotFoundException(`Theater with ID ${updateShowingDto.theaterId} not found`);
      }
      showing.theater = theater;
      theaterIdToUse = theater.id;
    }

    if (updateShowingDto.startTime) {
      const newStartTime = new Date(updateShowingDto.startTime);
      startTimeToUse = newStartTime;
      
      const standardTime = new Date();
      standardTime.setHours(newStartTime.getHours(), newStartTime.getMinutes(), 0, 0);
      showing.startTime = standardTime;
    }

    if (updateShowingDto.theaterId || updateShowingDto.startTime) {
      const hasOverlap = await this.checkTimeOverlap(
        theaterIdToUse, 
        startTimeToUse, 
        movieToUse.duration, 
        showing.id
      );
      
      if (hasOverlap) {
        throw new BadRequestException(`Time slot overlaps with existing showing for this theater`);
      }
    }

    const updatedShowing = await this.showingsRepository.save(showing);
    
    return {
      id: updatedShowing.id,
      theaterId: updatedShowing.theater.id,
      movieId: updatedShowing.movie.id,
      startTime: updatedShowing.startTime,
    };
  }

  async remove(id: number): Promise<{ success: boolean }> {
    const result = await this.showingsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Available Showing with ID ${id} not found`);
    }
    return { success: true };
  }
}