import { Module } from '@nestjs/common';
import { ApproveStockService } from './approve-stock.service';
import { ApproveStockController } from './approve-stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApproveStock } from './entities/approve-stock.entity';
import { AppService } from 'src/app.service';
import { StockPartsService } from 'src/stock-parts/stock-parts.service';
import { Bin } from 'src/bin/entities/bin.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { StockPartsModule } from 'src/stock-parts/stock-parts.module';
import { ModelsModule } from 'src/models/models.module';
import { ReferencesModule } from 'src/references/references.module';
import { Reference } from 'src/references/entities/reference.entity';
import { HistoryStockPart } from 'src/history-stock-part/entities/history-stock-part.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { BranchesModule } from 'src/branches/branches.module';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports :[BranchesModule,ModelsModule,ReferencesModule,StockPartsModule,TypeOrmModule.forFeature([ApproveStock, StockPart, Branch, Bin, Company, Reference, HistoryStockPart, Tracability])],
  controllers: [ApproveStockController],
  providers: [ApproveStockService, StockPartsService,AppService],
  exports: [TypeOrmModule, ApproveStockService],
})
export class ApproveStockModule {}
