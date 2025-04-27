import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { AdminGuard } from '../../../../shared/guards/admin.guard';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':movieId/ratings')
  createRating(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() createRatingDto: CreateRatingDto,
    @Request() req,
  ) {
    return this.moviesService.createOrUpdateRating(
      movieId, 
      req.user.id, 
      createRatingDto.rating
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':movieId/ratings')
  deleteRating(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Request() req,
  ) {
    return this.moviesService.deleteRating(movieId, req.user.id);
  }

  @Get(':movieId/ratings')
  getRatings(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Request() req,
  ) {
    const userId = req.user?.id || null;
    return this.moviesService.getMovieRatings(movieId, userId);
  }
}