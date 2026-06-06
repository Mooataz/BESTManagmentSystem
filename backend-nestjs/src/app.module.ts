import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from './company/company.module';
import { BrandsModule } from './brands/brands.module';
import { CustomersModule } from './customers/customers.module';
import { UsersModule } from './users/users.module';
import { DistributeurModule } from './distributeur/distributeur.module';
import { BranchesModule } from './branches/branches.module';
import { ModelsModule } from './models/models.module';
import { TypeModelModule } from './type-model/type-model.module';
import { AllPartsModule } from './all-parts/all-parts.module';
import { DevicesModule } from './devices/devices.module';
import { TracabilityModule } from './tracability/tracability.module';
import { TransfertModule } from './transfert/transfert.module';
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
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PdfModule } from './pdf/pdf.module';
import { StockAlertModule } from './stock-alert/stock-alert.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'mtz.123'),
        database: config.get<string>('DB_NAME', 'BEST_Managment_System'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      serveRoot: '/upload',
    }),
    ScheduleModule.forRoot(),
    CoreModule,
    CompanyModule,
    BrandsModule,
    CustomersModule,
    UsersModule,
    DistributeurModule,
    BranchesModule,
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
    StockAlertModule,
    SalesModule,
    AdminModule,
    AuthModule,
    NotificationModule,
    PdfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
