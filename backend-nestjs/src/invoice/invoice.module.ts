import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { User } from 'src/users/entities/user.entity';
import { OtherCost } from 'src/other-cost/entities/other-cost.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Invoice, Repair, User, OtherCost])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
