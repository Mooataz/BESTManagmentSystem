import { Module } from '@nestjs/common';
import { NotesCustomerService } from './notes-customer.service';
import { NotesCustomerController } from './notes-customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesCustomer } from './entities/notes-customer.entity';
import { AppService } from 'src/app.service';

@Module({
  imports:[TypeOrmModule.forFeature([NotesCustomer])],
  controllers: [NotesCustomerController],
  providers: [NotesCustomerService,AppService],
})
export class NotesCustomerModule {}
