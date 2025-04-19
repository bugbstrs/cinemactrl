import { Test, TestingModule } from '@nestjs/testing';
import { BookingServiceController } from './booking-service.controller';
import { BookingServiceService } from './booking-service.service';

describe('BookingServiceController', () => {
  let bookingServiceController: BookingServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BookingServiceController],
      providers: [BookingServiceService],
    }).compile();

    bookingServiceController = app.get<BookingServiceController>(BookingServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(bookingServiceController.getHello()).toBe('Hello World!');
    });
  });
});
