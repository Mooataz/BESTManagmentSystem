import { Module } from '@nestjs/common';
import { StocKeeperService } from './stoc-keeper.service';
import { StocKeeperController } from './stoc-keeper.controller';

@Module({
  controllers: [StocKeeperController],
  providers: [StocKeeperService],
})
export class StocKeeperModule {}
