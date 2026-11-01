import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { FieldsService } from '../fields/fields.service';

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingsService, FieldsService],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a valid booking', () => {
    const booking = service.create({
      userId: 1,
      fieldId: 1,
      date: '2026-11-05',
      startTime: '09:00',
      endTime: '10:00',
    });

    expect(booking).toMatchObject({
      id: 1,
      userId: 1,
      fieldId: 1,
      date: '2026-11-05',
      startTime: '09:00',
      endTime: '10:00',
      status: 'BOOKED',
    });
  });

  it('should reject overlapping bookings on the same field', () => {
    service.create({
      userId: 1,
      fieldId: 1,
      date: '2026-11-05',
      startTime: '09:00',
      endTime: '10:00',
    });

    expect(() =>
      service.create({
        userId: 2,
        fieldId: 1,
        date: '2026-11-05',
        startTime: '09:30',
        endTime: '10:30',
      }),
    ).toThrow(BadRequestException);
  });

  it('should allow bookings at adjacent times', () => {
    service.create({
      userId: 1,
      fieldId: 1,
      date: '2026-11-05',
      startTime: '09:00',
      endTime: '10:00',
    });

    const booking = service.create({
      userId: 2,
      fieldId: 1,
      date: '2026-11-05',
      startTime: '10:00',
      endTime: '11:00',
    });

    expect(booking.status).toBe('BOOKED');
  });

  it('should allow the same time on a different field', () => {
    service.create({
      userId: 1,
      fieldId: 1,
      date: '2026-11-05',
      startTime: '09:00',
      endTime: '10:00',
    });

    const booking = service.create({
      userId: 2,
      fieldId: 2,
      date: '2026-11-05',
      startTime: '09:00',
      endTime: '10:00',
    });

    expect(booking.fieldId).toBe(2);
  });

  it('should make a CANCELLED booking stop blocking its time slot', () => {
    const booking = service.create({
      userId: 1,
      fieldId: 1,
      date: '2026-11-05',
      startTime: '09:00',
      endTime: '10:00',
    });

    service.cancel(booking.id);

    const replacement = service.create({
      userId: 2,
      fieldId: 1,
      date: '2026-11-05',
      startTime: '09:00',
      endTime: '10:00',
    });

    expect(replacement.status).toBe('BOOKED');
  });

  it('should reject an invalid time range', () => {
    expect(() =>
      service.create({
        userId: 1,
        fieldId: 1,
        date: '2026-11-05',
        startTime: '10:00',
        endTime: '09:00',
      }),
    ).toThrow(BadRequestException);
  });
  
  it('should reject a non-positive user ID', () => {
    expect(() =>
      service.create({
        userId: 0,
        fieldId: 1,
        date: '2026-11-05',
        startTime: '09:00',
        endTime: '10:00',
      }),
    ).toThrow(BadRequestException);
  });

  it('should reject an invalid date format', () => {
    expect(() =>
      service.create({
        userId: 1,
        fieldId: 1,
        date: '05-11-2026',
        startTime: '09:00',
        endTime: '10:00',
      }),
    ).toThrow(BadRequestException);
  });

  it('should reject an invalid time format', () => {
    expect(() =>
      service.create({
        userId: 1,
        fieldId: 1,
        date: '2026-11-05',
        startTime: '9:00',
        endTime: '10:00',
      }),
    ).toThrow(BadRequestException);
  });

  it('should reject a field that does not exist', () => {
    expect(() =>
      service.create({
        userId: 1,
        fieldId: 999,
        date: '2026-11-05',
        startTime: '09:00',
        endTime: '10:00',
      }),
    ).toThrow(NotFoundException);
  });

  it('should exclude CANCELLED bookings from availability', () => {
    const booking = service.create({
      userId: 1,
      fieldId: 1,
      date: '2026-11-05',
      startTime: '09:00',
      endTime: '10:00',
    });

    service.cancel(booking.id);

    expect(service.getAvailability(1, '2026-11-05')).toEqual([]);
  });

  it('should return only bookings belonging to the requested user', () => {
    service.create({
      userId: 1,
      fieldId: 1,
      date: '2026-11-05',
      startTime: '09:00',
      endTime: '10:00',
    });

    service.create({
      userId: 2,
      fieldId: 2,
      date: '2026-11-05',
      startTime: '09:00',
      endTime: '10:00',
    });

    const bookings = service.findByUser(1);

    expect(bookings).toHaveLength(1);
    expect(bookings[0].userId).toBe(1);
  });

});
