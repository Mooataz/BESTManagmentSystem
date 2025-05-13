import { Module } from '@nestjs/common';
import { AllPartsService } from './all-parts.service';
import { AllPartsController } from './all-parts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllPart } from './entities/all-part.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([AllPart])],
  controllers: [AllPartsController],
  providers: [AllPartsService,AppService],
})
export class AllPartsModule {}
