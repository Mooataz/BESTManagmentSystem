import { Module } from '@nestjs/common';
import { TransfertService } from './transfert.service';
import { TransfertController } from './transfert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfert } from './entities/transfert.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { User } from 'src/users/entities/user.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { HistoryRepair } from 'src/history-repair/entities/history-repair.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { StockPartsModule } from 'src/stock-parts/stock-parts.module';
import { HistoryStockPartModule } from 'src/history-stock-part/history-stock-part.module';

@Module({
  imports : [TypeOrmModule. forFeature([Transfert, StockPart, Repair, User, Branch, HistoryRepair, Tracability]), StockPartsModule, HistoryStockPartModule],
  controllers: [TransfertController],
  providers: [TransfertService],
})
export class TransfertModule {}
