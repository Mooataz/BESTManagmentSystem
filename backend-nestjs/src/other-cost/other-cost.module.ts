import { Module } from '@nestjs/common';
import { OtherCostService } from './other-cost.service';
import { OtherCostController } from './other-cost.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtherCost } from './entities/other-cost.entity';
import { AppService } from 'src/app.service';

@Module({imports : [TypeOrmModule.forFeature([OtherCost])],
  controllers: [OtherCostController],
  providers: [OtherCostService,AppService],
})
export class OtherCostModule {}
