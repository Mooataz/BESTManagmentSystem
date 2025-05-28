import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { CoreController } from './core.controller';
import { AppService } from 'src/app.service';

@Module({
  controllers: [CoreController],
  providers: [CoreService,AppService],
  exports:[AppService]
})
export class CoreModule {}
