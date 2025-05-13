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
import { AppModule } from 'src/app.module';
import { Branch } from 'src/branches/entities/branch.entity';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports: [ModelsModule,ReferencesModule,/* AppModule, */ TypeOrmModule.forFeature([StockPart,  Model, Reference, AllPart, Branch, Bin, Company])],
  controllers: [StockPartsController],
  providers: [StockPartsService, AppService],
  exports:[StockPartsService]
})
export class StockPartsModule {}
