import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockAlert } from './entities/stock-alert.entity';
import { StockAlertService } from './stock-alert.service';
import { StockAlertController } from './stock-alert.controller';
import { Company } from 'src/company/entities/company.entity';
import { Model } from 'src/models/entities/model.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { Reference } from 'src/references/entities/reference.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Bin } from 'src/bin/entities/bin.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { User } from 'src/users/entities/user.entity';
import { PdfService } from 'src/pdf/pdf.service';
import { Repair } from 'src/repair/entities/repair.entity';
import { Legislation } from 'src/legislation/entities/legislation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockAlert,
      Company,
      Model,
      AllPart,
      Reference,
      StockPart,
      Bin,
      Branch,
      User,
      Repair,
      Legislation,
    ]),
  ],
  controllers: [StockAlertController],
  providers: [StockAlertService, PdfService],
  exports: [StockAlertService],
})
export class StockAlertModule {}
