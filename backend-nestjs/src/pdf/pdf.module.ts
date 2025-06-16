import { forwardRef, Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { Repair } from 'src/repair/entities/repair.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/customers/entities/customer.entity';
import { Device } from 'src/devices/entities/device.entity';
import { RepairModule } from 'src/repair/repair.module';
import { RepairService } from 'src/repair/repair.service';
import { AccessoryModule } from 'src/accessory/accessory.module';
import { ListFault } from 'src/list-fault/entities/list-fault.entity';
import { ListFaultModule } from 'src/list-fault/list-fault.module';
import { CustomerRequestModule } from 'src/customer-request/customer-request.module';
import { NotesCustomerModule } from 'src/notes-customer/notes-customer.module';
import { ExpertiseReasonsModule } from 'src/expertise-reasons/expertise-reasons.module';
import { RepairActionModule } from 'src/repair-action/repair-action.module';
import { UsersModule } from 'src/users/users.module';
import { StockPartsModule } from 'src/stock-parts/stock-parts.module';
import { ApproveStockModule } from 'src/approve-stock/approve-stock.module';
import { AppModule } from 'src/app.module';
import { AppService } from 'src/app.service';
import { CoreModule } from 'src/core/core.module';
import { Legislation } from 'src/legislation/entities/legislation.entity';
import { Branch } from 'src/branches/entities/branch.entity';

@Module({
  imports:[
    forwardRef(() => RepairModule),
     forwardRef(() => ApproveStockModule),
     forwardRef(() => UsersModule),
     forwardRef(() => RepairActionModule),
     forwardRef(() => ListFaultModule),
     forwardRef(() => StockPartsModule),
     forwardRef(() => ExpertiseReasonsModule),
     forwardRef(() => CustomerRequestModule),
     forwardRef(() => NotesCustomerModule),
     forwardRef(() => AccessoryModule),
    CoreModule,
    TypeOrmModule.forFeature([Repair, Customer, Device,Legislation, Branch])    ,       ], 
  controllers: [PdfController],
  providers: [PdfService, RepairService ],
  exports:[PdfService]
})
export class PdfModule {}
