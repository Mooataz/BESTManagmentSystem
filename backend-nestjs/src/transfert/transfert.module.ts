import { Module } from '@nestjs/common';
import { TransfertService } from './transfert.service';
import { TransfertController } from './transfert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfert } from './entities/transfert.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Repair } from 'src/repair/entities/repair.entity';

@Module({
  imports : [TypeOrmModule. forFeature([Transfert, StockPart, Repair])],
  controllers: [TransfertController],
  providers: [TransfertService],
})
export class TransfertModule {}
