import { Module } from '@nestjs/common';
import { LevelRepairService } from './level-repair.service';
import { LevelRepairController } from './level-repair.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelRepair } from './entities/level-repair.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([LevelRepair])],
  controllers: [LevelRepairController],
  providers: [LevelRepairService,AppService],
})
export class LevelRepairModule {}
