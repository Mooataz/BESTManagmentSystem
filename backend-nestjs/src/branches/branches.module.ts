import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { Branch } from './entities/branch.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Branch, Company])],
  controllers: [BranchesController],
  providers: [BranchesService,AppService],
 // exports: [branchRepositry],
})
export class BranchesModule {}
