import { Module } from '@nestjs/common';
import { LegislationService } from './legislation.service';
import { LegislationController } from './legislation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Legislation } from './entities/legislation.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([Legislation])],
  controllers: [LegislationController],
  providers: [LegislationService,AppService],
})
export class LegislationModule {}
