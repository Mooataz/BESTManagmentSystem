import { Module } from '@nestjs/common';
import { LegislationService } from './legislation.service';
import { LegislationController } from './legislation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Legislation } from './entities/legislation.entity';
import { Company } from 'src/company/entities/company.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([Legislation, Company])],
  controllers: [LegislationController],
  providers: [LegislationService,AppService],
})
export class LegislationModule {}
