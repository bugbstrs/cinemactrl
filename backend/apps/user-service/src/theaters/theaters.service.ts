import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theater } from '../../../backend/src/entities/theater.entity';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';

@Injectable()
export class TheatersService {
  constructor(
    @InjectRepository(Theater)
    private theatersRepository: Repository<Theater>,
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
    const result = await this.theatersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Theater with ID ${id} not found`);
    }
    return { success: true };
  }
}