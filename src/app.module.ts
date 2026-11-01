import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FieldsModule } from './fields/fields.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [FieldsModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
