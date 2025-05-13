import { Module } from '@nestjs/common';
import { CoordinateService } from './coordinate.service';
import { CoordinateController } from './coordinate.controller';

@Module({
  controllers: [CoordinateController],
  providers: [CoordinateService],
})
export class CoordinateModule {}
