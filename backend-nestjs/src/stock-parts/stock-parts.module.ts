import { Module } from '@nestjs/common';
import { StockPartsService } from './stock-parts.service';
import { StockPartsController } from './stock-parts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockPart } from './entities/stock-part.entity';
import { AppService } from 'src/app.service';
import { Bin } from 'src/bin/entities/bin.entity';
import { ModelsService } from 'src/models/models.service';
import { ReferencesService } from 'src/references/references.service';
import { Model } from 'src/models/entities/model.entity';
import { Reference } from 'src/references/entities/reference.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { ModelsModule } from 'src/models/models.module';
import { ReferencesModule } from 'src/references/references.module';
import { Branch } from 'src/branches/entities/branch.entity';
import { Company } from 'src/company/entities/company.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { HistoryStockPart } from 'src/history-stock-part/entities/history-stock-part.entity';
import { PdfService } from 'src/pdf/pdf.service';
import { Pdf } from 'src/pdf/entities/pdf.entity';
import { Legislation } from 'src/legislation/entities/legislation.entity';
import { StockGateway } from './Stock.Gateway';
import { User } from 'src/users/entities/user.entity';
import { RepairModule } from 'src/repair/repair.module';

@Module({
  imports: [ModelsModule, ReferencesModule, RepairModule, TypeOrmModule.forFeature([StockPart, StockGateway, Model,User, Reference, AllPart, Branch, Bin, Company, Tracability, HistoryStockPart, Pdf, Legislation])],
  controllers: [StockPartsController],
  providers: [StockPartsService, AppService, PdfService, StockGateway],
  exports:[TypeOrmModule, StockPartsService, PdfService, StockGateway]
})
export class StockPartsModule {}
