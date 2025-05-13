import { Module } from '@nestjs/common';
import { ReferencesService } from './references.service';
import { ReferencesController } from './references.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reference } from './entities/reference.entity';
import { Model } from 'src/models/entities/model.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reference,Model,AllPart])],
  controllers: [ReferencesController],
  providers: [ReferencesService,AppService],
  exports:[ReferencesService]
})
export class ReferencesModule {}
