import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoicePdfService } from './invoice-pdf.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { User } from 'src/users/entities/user.entity';
import { OtherCost } from 'src/other-cost/entities/other-cost.entity';
import { PartsPrice } from 'src/parts-price/entities/parts-price.entity';
import { LevelRepair } from 'src/level-repair/entities/level-repair.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Repair, User, OtherCost, PartsPrice, LevelRepair, AllPart, Company])],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoicePdfService],
})
export class InvoiceModule {}
