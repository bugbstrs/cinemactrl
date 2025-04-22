import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, ParseIntPipe, } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TheatersService } from './theaters.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Theaters')
@Controller('theaters')
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) {}

  @Get()
  findAll() {
    return this.theatersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.theatersService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() createTheaterDto: CreateTheaterDto) {
    return this.theatersService.create(createTheaterDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTheaterDto: UpdateTheaterDto,
  ) {
    return this.theatersService.update(id, updateTheaterDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.theatersService.remove(id);
  }
}