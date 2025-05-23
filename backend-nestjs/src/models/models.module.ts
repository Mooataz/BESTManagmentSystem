import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { AppService } from 'src/app.service';
import { Brand } from 'src/brands/entities/brand.entity';
import { TypeModel } from 'src/type-model/entities/type-model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Model,AllPart, Brand, TypeModel])],
  controllers: [ModelsController],
  providers: [ModelsService,AppService],
  exports: [ModelsService]
})
export class ModelsModule {}
