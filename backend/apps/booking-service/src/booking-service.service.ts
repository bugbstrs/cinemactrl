import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookingServiceService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
  ) {
    // this.bookingRepo.insert({
    //   id: 4
    // }).then(() => {
    //   console.log('Inserted a new booking into the database: 4');
    // })
  }
  getHello(): string {
    return 'Hello World!';
  }
}
