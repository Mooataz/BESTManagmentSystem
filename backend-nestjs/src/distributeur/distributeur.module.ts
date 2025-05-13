import { Module } from '@nestjs/common';
import { DistributeurService } from './distributeur.service';
import { DistributeurController } from './distributeur.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Distributeur } from './entities/distributeur.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([Distributeur])],
  controllers: [DistributeurController],
  providers: [DistributeurService,AppService],
})
export class DistributeurModule {}
