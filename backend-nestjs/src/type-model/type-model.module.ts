import { Module } from '@nestjs/common';
import { TypeModelService } from './type-model.service';
import { TypeModelController } from './type-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeModel } from './entities/type-model.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([TypeModel])],
  controllers: [TypeModelController],
  providers: [TypeModelService, AppService],
})
export class TypeModelModule {}
