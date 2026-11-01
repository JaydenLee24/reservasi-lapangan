import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FieldsService } from '../fields/fields.service';
import { Booking } from './bookings.types';

@Injectable()
export class BookingsService {
  private bookings: Booking[] = [];
  private nextId = 1;

  constructor(private readonly fieldsService: FieldsService) {}

  create(data: {
    userId: number;
    fieldId: number;
    date: string;
    startTime: string;
    endTime: string;
  }) {
    const { userId, fieldId, date, startTime, endTime } = data;

    if (
      !Number.isInteger(userId) ||
      userId <= 0 ||
      !Number.isInteger(fieldId) ||
      fieldId <= 0
    ) {
      throw new BadRequestException('userId dan fieldId harus berupa bilangan bulat positif');
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Format date harus YYYY-MM-DD');
    }

    const validTime = (time: string) =>
      typeof time === 'string' &&
      /^([01]\d|2[0-3]):[0-5]\d$/.test(time);

    if (!validTime(startTime) || !validTime(endTime)) {
      throw new BadRequestException('Format waktu harus HH:mm');
    }

    if (startTime >= endTime) {
      throw new BadRequestException('endTime harus lebih besar dari startTime');
    }

    this.fieldsService.findOne(fieldId);

    const conflict = this.bookings.some(
      (booking) =>
        booking.fieldId === fieldId &&
        booking.date === date &&
        booking.status === 'BOOKED' &&
        startTime < booking.endTime &&
        endTime > booking.startTime,
    );

    if (conflict) {
      throw new BadRequestException(
        'Jadwal lapangan sudah dipesan pada waktu tersebut',
      );
    }

    const booking: Booking = {
      id: this.nextId++,
      userId,
      fieldId,
      date,
      startTime,
      endTime,
      status: 'BOOKED',
    };

    this.bookings.push(booking);
    return booking;
  }

  findOne(id: number) {
    const booking = this.bookings.find((item) => item.id === id);

    if (!booking) {
      throw new NotFoundException(`Booking dengan ID ${id} tidak ditemukan`);
    }

    return booking;
  }

  findByUser(userId: number) {
    return this.bookings.filter((booking) => booking.userId === userId);
  }

  cancel(id: number) {
    const booking = this.findOne(id);

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking sudah dibatalkan');
    }

    booking.status = 'CANCELLED';
    return booking;
  }

  getAvailability(fieldId: number, date: string) {
    this.fieldsService.findOne(fieldId);

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Format date harus YYYY-MM-DD');
    }

    return this.bookings
      .filter(
        (booking) =>
          booking.fieldId === fieldId &&
          booking.date === date &&
          booking.status === 'BOOKED',
      )
      .map((booking) => ({
        startTime: booking.startTime,
        endTime: booking.endTime,
      }));
  }
}
