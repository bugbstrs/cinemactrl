import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../../../../shared/entities/reservation.entity';
import { AvailableShowing } from '../../../../shared/entities/available-showing.entity';
import { Theater } from '../../../../shared/entities/theater.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { User } from '../../../../shared/entities/user.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(AvailableShowing)
    private showingsRepository: Repository<AvailableShowing>,
    @InjectRepository(Theater)
    private theatersRepository: Repository<Theater>,
  ) {}

  async getUserReservations(userId: number): Promise<any[]> {
    const reservations = await this.reservationsRepository.find({
      where: { user: { id: userId } },
      relations: ['showing', 'showing.movie', 'showing.theater'],
    });

    return reservations.map(reservation => ({
      id: reservation.id,
      userId: userId,
      showingId: reservation.showing.id,
      seat: reservation.seat,
      movieName: reservation.showing.movie.name,
      theaterName: reservation.showing.theater.name,
      startTime: reservation.showing.startTime,
    }));
  }

  async create(userId: number, createReservationDto: CreateReservationDto): Promise<any> {
    const { showingId, seat } = createReservationDto;

    const showing = await this.showingsRepository.findOne({
      where: { id: showingId },
      relations: ['theater'],
    });

    if (!showing) {
      throw new NotFoundException(`Showing with ID ${showingId} not found`);
    }

    const existingReservation = await this.reservationsRepository.findOne({
      where: { 
        showing: { id: showingId },
        seat: seat 
      }
    });

    if (existingReservation) {
      throw new BadRequestException(`Seat ${seat} is already reserved for this showing`);
    }

    const seatNumber = parseInt(seat.replace(/[^0-9]/g, ''), 10);
    if (isNaN(seatNumber) || seatNumber < 1 || seatNumber > showing.theater.capacity) {
      throw new BadRequestException(`Invalid seat. Theater capacity is ${showing.theater.capacity}`);
    }

    const reservation = this.reservationsRepository.create({
      showing: { id: showingId },
      user: { id: userId },
      seat: seat,
    });

    const savedReservation = await this.reservationsRepository.save(reservation);

    return {
      id: savedReservation.id,
      userId: userId,
      showingId: showingId,
      seat: seat,
    };
  }

  async cancel(reservationId: number, userId: number): Promise<{ success: boolean }> {
    const reservation = await this.reservationsRepository.findOne({
      where: { 
        id: reservationId,
        user: { id: userId } 
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${reservationId} not found or does not belong to you`);
    }

    await this.reservationsRepository.remove(reservation);
    return { success: true };
  }
}