import { Module } from '@nestjs/common';
import { BinService } from './bin.service';
import { BinController } from './bin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bin } from './entities/bin.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bin, Branch])],
  controllers: [BinController],
  providers: [BinService,AppService],
})
export class BinModule {}
