import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from './company/company.module';
import { Company } from './company/entities/company.entity';
import { BrandsModule } from './brands/brands.module';
import { Brand } from './brands/entities/brand.entity';
import { CustomersModule } from './customers/customers.module';
import { Customer } from './customers/entities/customer.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { DistributeurModule } from './distributeur/distributeur.module';
import { Distributeur } from './distributeur/entities/distributeur.entity';
import { BranchesModule } from './branches/branches.module';
import { Branch } from './branches/entities/branch.entity';
import { PermissionModule } from './permission/permission.module';
import { Permission } from './permission/entities/permission.entity';
import { ModelsModule } from './models/models.module';
import { Model } from './models/entities/model.entity';
import { TypeModelModule } from './type-model/type-model.module';
import { TypeModel } from './type-model/entities/type-model.entity';
import { AllPartsModule } from './all-parts/all-parts.module';
import { AllPart } from './all-parts/entities/all-part.entity';
import { DevicesModule } from './devices/devices.module';
import { Device } from './devices/entities/device.entity';
import { TracabilityModule } from './tracability/tracability.module';
import { Tracability } from './tracability/entities/tracability.entity';
import { TransfertModule } from './transfert/transfert.module';
import { Transfert } from './transfert/entities/transfert.entity';
import { PartsPriceModule } from './parts-price/parts-price.module';
import { ReferencesModule } from './references/references.module';
import { BinModule } from './bin/bin.module';
import { StockPartsModule } from './stock-parts/stock-parts.module';
import { AccessoryModule } from './accessory/accessory.module';
import { RepairModule } from './repair/repair.module';
import { ApproveStockModule } from './approve-stock/approve-stock.module';
import { ListFaultModule } from './list-fault/list-fault.module';
import { CustomerRequestModule } from './customer-request/customer-request.module';
import { LegislationModule } from './legislation/legislation.module';
import { NotesCustomerModule } from './notes-customer/notes-customer.module';
import { ExpertiseReasonsModule } from './expertise-reasons/expertise-reasons.module';
import { RepairActionModule } from './repair-action/repair-action.module';
import { OutputListModule } from './output-list/output-list.module';
import { HistoryRepairModule } from './history-repair/history-repair.module';
import { HistoryStockPartModule } from './history-stock-part/history-stock-part.module';
import { OtherCostModule } from './other-cost/other-cost.module';
import { InvoiceModule } from './invoice/invoice.module';
import { LevelRepairModule } from './level-repair/level-repair.module';
import { SalesModule } from './sales/sales.module';
import { AdminModule } from './admin/admin.module';
import { TechnicienModule } from './technicien/technicien.module';
import { StocKeeperModule } from './stoc-keeper/stoc-keeper.module';
import { CoordinateModule } from './coordinate/coordinate.module';
import { ReceptionistModule } from './receptionist/receptionist.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mtz.123',
      database: 'BEST_Managment_System',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
                 
      synchronize: true,
    }),
    CompanyModule,
    BrandsModule,
    CustomersModule,
    UsersModule,
    DistributeurModule,
    BranchesModule,
    PermissionModule,
    ModelsModule,
    TypeModelModule,
    AllPartsModule,
    DevicesModule,
    TracabilityModule,
    TransfertModule,
    PartsPriceModule,
    ReferencesModule,
    BinModule,
    StockPartsModule,
    AccessoryModule,
    RepairModule,
    ApproveStockModule,
    ListFaultModule,
    CustomerRequestModule,
    LegislationModule,
    NotesCustomerModule,
    ExpertiseReasonsModule,
    RepairActionModule,
    OutputListModule,
    HistoryRepairModule,
    HistoryStockPartModule,
    OtherCostModule,
    InvoiceModule,
    LevelRepairModule,
    SalesModule,
    AdminModule,
    TechnicienModule,
    StocKeeperModule,
    CoordinateModule,
    ReceptionistModule,
    AuthModule,
    ConfigModule.forRoot({isGlobal: true}),
    NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports:[AppService]
})
export class AppModule {}
