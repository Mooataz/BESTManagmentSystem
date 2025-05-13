import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { Brand } from './entities/brand.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [BrandsController],
  providers: [BrandsService,AppService],
})
export class BrandsModule {}
