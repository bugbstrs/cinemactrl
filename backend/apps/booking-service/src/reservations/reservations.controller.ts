import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';

@ApiTags('Reservations')
@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('reservations')
  getUserReservations(@Request() req) {
    return this.reservationsService.getUserReservations(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('reservations')
  create(@Request() req, @Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(req.user.id, createReservationDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('reservations/:id')
  cancel(@Param('id', ParseIntPipe) reservationId: number, @Request() req) {
    return this.reservationsService.cancel(reservationId, req.user.id);
  }
}