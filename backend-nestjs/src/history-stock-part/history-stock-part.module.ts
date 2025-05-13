import { Module } from '@nestjs/common';
import { HistoryStockPartService } from './history-stock-part.service';
import { HistoryStockPartController } from './history-stock-part.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryStockPart } from './entities/history-stock-part.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryStockPart])],
  controllers: [HistoryStockPartController],
  providers: [HistoryStockPartService],
})
export class HistoryStockPartModule {}
