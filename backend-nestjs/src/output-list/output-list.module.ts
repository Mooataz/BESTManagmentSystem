import { Module } from '@nestjs/common';
import { OutputListService } from './output-list.service';
import { OutputListController } from './output-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutputList } from './entities/output-list.entity';
import { Repair } from 'src/repair/entities/repair.entity';
import { User } from 'src/users/entities/user.entity';
import { Customer } from 'src/customers/entities/customer.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([OutputList,Repair, User, Customer])],
  controllers: [OutputListController],
  providers: [OutputListService],
})
export class OutputListModule {}
