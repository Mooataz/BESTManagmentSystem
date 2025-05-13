import { Module } from '@nestjs/common';
import { RepairActionService } from './repair-action.service';
import { RepairActionController } from './repair-action.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairAction } from './entities/repair-action.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RepairAction])],
  controllers: [RepairActionController],
  providers: [RepairActionService],
})
export class RepairActionModule {}
