import { Module } from '@nestjs/common';
import { HistoryRepairService } from './history-repair.service';
import { HistoryRepairController } from './history-repair.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryRepair } from './entities/history-repair.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryRepair, Repair, Tracability, User])],
  controllers: [HistoryRepairController],
  providers: [HistoryRepairService],
})
export class HistoryRepairModule {}
