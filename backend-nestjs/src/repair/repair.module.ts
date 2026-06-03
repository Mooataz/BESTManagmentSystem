import { Module } from '@nestjs/common';
import { RepairService } from './repair.service';
import { RepairController } from './repair.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repair } from './entities/repair.entity';
import { Accessory } from 'src/accessory/entities/accessory.entity';
import { ListFault } from 'src/list-fault/entities/list-fault.entity';
import { CustomerRequest } from 'src/customer-request/entities/customer-request.entity';
import { NotesCustomer } from 'src/notes-customer/entities/notes-customer.entity';
import { ExpertiseReason } from 'src/expertise-reasons/entities/expertise-reason.entity';
import { RepairAction } from 'src/repair-action/entities/repair-action.entity';
import { AppService } from 'src/app.service';
import { BranchAccessGuard } from 'src/guards/branch-access.guard';
import { User } from 'src/users/entities/user.entity';
import { Device } from 'src/devices/entities/device.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { ApproveStock } from 'src/approve-stock/entities/approve-stock.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { HistoryRepair } from 'src/history-repair/entities/history-repair.entity';
import { Tracability } from 'src/tracability/entities/tracability.entity';
import { PartsPrice } from 'src/parts-price/entities/parts-price.entity';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Repair,HistoryRepair,Accessory,ListFault,CustomerRequest,NotesCustomer, ExpertiseReason, RepairAction, Device, User, StockPart, ApproveStock,Customer, Tracability, PartsPrice, Company])],
  controllers: [RepairController],
  providers: [RepairService, AppService, BranchAccessGuard],
  exports: [TypeOrmModule,RepairService],
})
export class RepairModule {}
