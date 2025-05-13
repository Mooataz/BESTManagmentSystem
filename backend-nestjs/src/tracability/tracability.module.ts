import { Module } from '@nestjs/common';
import { TracabilityService } from './tracability.service';
import { TracabilityController } from './tracability.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tracability } from './entities/tracability.entity';
import { User } from 'src/users/entities/user.entity';
import { HistoryRepair } from 'src/history-repair/entities/history-repair.entity';
import { HistoryStockPart } from 'src/history-stock-part/entities/history-stock-part.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tracability, User, HistoryRepair, HistoryStockPart])],
  controllers: [TracabilityController],
  providers: [TracabilityService],
})
export class TracabilityModule {}
