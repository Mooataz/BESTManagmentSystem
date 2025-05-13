import { Module } from '@nestjs/common';
import { ExpertiseReasonsService } from './expertise-reasons.service';
import { ExpertiseReasonsController } from './expertise-reasons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpertiseReason } from './entities/expertise-reason.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExpertiseReason])],
  controllers: [ExpertiseReasonsController],
  providers: [ExpertiseReasonsService,AppService],
})
export class ExpertiseReasonsModule {}
