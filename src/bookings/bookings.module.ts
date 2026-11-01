import { Module } from '@nestjs/common';
import { FieldsModule } from '../fields/fields.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [FieldsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
