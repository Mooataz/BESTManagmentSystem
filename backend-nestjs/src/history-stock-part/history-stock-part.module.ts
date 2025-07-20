import { Module } from '@nestjs/common';
import { HistoryStockPartService } from './history-stock-part.service';
import { HistoryStockPartController } from './history-stock-part.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryStockPart } from './entities/history-stock-part.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { User } from 'src/users/entities/user.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryStockPart,StockPart,User,Tracability])],
  controllers: [HistoryStockPartController],
  providers: [HistoryStockPartService],
})
export class HistoryStockPartModule {}
