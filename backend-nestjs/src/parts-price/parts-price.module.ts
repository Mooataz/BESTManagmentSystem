import { Module } from '@nestjs/common';
import { PartsPriceService } from './parts-price.service';
import { PartsPriceController } from './parts-price.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartsPrice } from './entities/parts-price.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { Company } from 'src/company/entities/company.entity';
import { Model } from 'src/models/entities/model.entity';
import { LevelRepair } from 'src/level-repair/entities/level-repair.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PartsPrice, AllPart, Company, Model, LevelRepair])],
  controllers: [PartsPriceController],
  providers: [PartsPriceService],
})
export class PartsPriceModule {}
