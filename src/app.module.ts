import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FieldsModule } from './fields/fields.module';

@Module({
  imports: [FieldsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
