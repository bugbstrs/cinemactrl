import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
