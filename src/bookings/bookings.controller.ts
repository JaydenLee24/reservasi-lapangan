import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('fields/:id/availability')
  getAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Query('date') date: string,
  ) {
    return this.bookingsService.getAvailability(id, date);
  }
  
  @Post('bookings')
  create(@Body() body: {
    userId: number;
    customerName: string;
    fieldId: number;
    date: string;
    startTime: string;
    endTime: string;
  }) {
    return this.bookingsService.create(body);
  }

  @Get('bookings/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @Get('users/:userId/bookings')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.bookingsService.findByUser(userId);
  }

  @Patch('bookings/:id/cancel')
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.cancel(id);
  }
}
