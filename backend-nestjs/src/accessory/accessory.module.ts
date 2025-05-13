import { Module } from '@nestjs/common';
import { AccessoryService } from './accessory.service';
import { AccessoryController } from './accessory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accessory } from './entities/accessory.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [ TypeOrmModule.forFeature([Accessory])],
  controllers: [AccessoryController],
  providers: [AccessoryService,AppService],
})
export class AccessoryModule {}
