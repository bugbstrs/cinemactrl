import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theater } from '../../../../shared/entities/theater.entity';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { AvailableShowing } from 'shared/entities/available-showing.entity';
import { Reservation } from 'shared/entities/reservation.entity';

@Injectable()
export class TheatersService {
  constructor(
    @InjectRepository(Theater)
    private theatersRepository: Repository<Theater>,
    @InjectRepository(AvailableShowing)
    private showingsRepository: Repository<AvailableShowing>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async findAll(): Promise<Theater[]> {
    return this.theatersRepository.find();
  }

  async findOne(id: number): Promise<Theater> {
    const theater = await this.theatersRepository.findOne({ where: { id } });
    if (!theater) {
      throw new NotFoundException(`Theater with ID ${id} not found`);
    }
    return theater;
  }

  async create(createTheaterDto: CreateTheaterDto): Promise<Theater> {
    const theater = this.theatersRepository.create(createTheaterDto);
    return this.theatersRepository.save(theater);
  }

  async update(id: number, updateTheaterDto: UpdateTheaterDto): Promise<Theater> {
    const theater = await this.findOne(id);
    
    Object.assign(theater, updateTheaterDto);
    
    return this.theatersRepository.save(theater);
  }

  async remove(id: number): Promise<{ success: boolean }> {
    // Find all reservations related to this theater
    const reservationsForTheater = await this.reservationRepository.find({
      where: { showing: { theater: { id } } },
    });

    // Delete all reservations by their ids
    if (reservationsForTheater.length > 0) {
      const reservationIds = reservationsForTheater.map(r => r.id);
      await this.reservationRepository.delete(reservationIds);
    }

    // Find all showings for this theater
    const showingsForTheater = await this.showingsRepository.find({
      where: { theater: { id } },
    });

    // Delete all showings by their ids
    if (showingsForTheater.length > 0) {
      const showingIds = showingsForTheater.map(s => s.id);
      await this.showingsRepository.delete(showingIds);
    }

    const result = await this.theatersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Theater with ID ${id} not found`);
    }
    return { success: true };
  }
}
