import { Module } from '@nestjs/common';
import { ListFaultService } from './list-fault.service';
import { ListFaultController } from './list-fault.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListFault } from './entities/list-fault.entity';
import { AppService } from 'src/app.service';

@Module({
  imports:[TypeOrmModule.forFeature([ListFault])],
  controllers: [ListFaultController],
  providers: [ListFaultService,AppService],
})
export class ListFaultModule {}
