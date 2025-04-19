import { Controller, Get } from '@nestjs/common';
import { BookingServiceService } from './booking-service.service';

@Controller()
export class BookingServiceController {
  constructor(private readonly bookingServiceService: BookingServiceService) {}

  @Get()
  getHello(): string {
    return this.bookingServiceService.getHello();
  }
}
