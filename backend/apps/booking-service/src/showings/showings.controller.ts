import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ShowingsService } from './showings.service';
import { CreateShowingDto } from './dto/create-showing.dto';
import { UpdateShowingDto } from './dto/update-showing.dto';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { AdminGuard } from '../../../../shared/guards/admin.guard';

@ApiTags('Showings')
@Controller('showings')
export class ShowingsController {
  constructor(private readonly showingsService: ShowingsService) {}

  @Get()
  findAll() {
    return this.showingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.showingsService.findOne(id);
  }

  @Get(':id/available-seats')
  getAvailableSeats(@Param('id', ParseIntPipe) showingId: number) {
    return this.showingsService.getAvailableSeats(showingId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() createShowingDto: CreateShowingDto) {
    return this.showingsService.create(createShowingDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShowingDto: UpdateShowingDto,
  ) {
    return this.showingsService.update(id, updateShowingDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.showingsService.remove(id);
  }
}