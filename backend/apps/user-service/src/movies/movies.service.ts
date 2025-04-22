import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../../../backend/src/entities/movie.entity';
import { Rating } from '../../../backend/src/entities/rating.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}

  async findAll(): Promise<Movie[]> {
    return this.moviesRepository.find();
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.moviesRepository.create({
      ...createMovieDto,
      releaseDate: new Date(createMovieDto.releaseDate),
    });
    return this.moviesRepository.save(movie);
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);
    
    Object.assign(movie, updateMovieDto);
    
    if (updateMovieDto.releaseDate) {
      movie.releaseDate = new Date(updateMovieDto.releaseDate);
    }
    
    return this.moviesRepository.save(movie);
  }

  async remove(id: number): Promise<{ success: boolean }> {
    const result = await this.moviesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return { success: true };
  }

  async createOrUpdateRating(movieId: number, userId: number, rating: number): Promise<{ success: boolean }> {
    const movie = await this.findOne(movieId);
    
    const existingRating = await this.ratingRepository.findOne({
      where: { movie: { id: movieId }, user: { id: userId } },
    });
    
    if (existingRating) {
      existingRating.rating = rating;
      await this.ratingRepository.save(existingRating);
    } else {
      const newRating = this.ratingRepository.create({
        movie: { id: movieId },
        user: { id: userId },
        rating,
      });
      await this.ratingRepository.save(newRating);
    }
    
    return { success: true };
  }

  async deleteRating(movieId: number, userId: number): Promise<{ success: boolean }> {
    const result = await this.ratingRepository.delete({
      movie: { id: movieId },
      user: { id: userId },
    });
    
    if (result.affected === 0) {
      throw new NotFoundException(`Rating for movie ID ${movieId} not found`);
    }
    
    return { success: true };
  }

  async getMovieRatings(movieId: number, userId: number): Promise<{ averageRating: number, totalRatings: number, rated: boolean }> {
    const movie = await this.findOne(movieId);
    
    const ratings = await this.ratingRepository.find({
      where: { movie: { id: movieId } },
    });
    
    const totalRatings = ratings.length;
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = totalRatings > 0 ? sum / totalRatings : 0;
    
    const userRated = await this.ratingRepository.findOne({
      where: { movie: { id: movieId }, user: { id: userId } },
    });
    
    return {
      averageRating,
      totalRatings,
      rated: !!userRated,
    };
  }
}