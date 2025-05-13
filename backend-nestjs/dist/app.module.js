"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const company_module_1 = require("./company/company.module");
const brands_module_1 = require("./brands/brands.module");
const customers_module_1 = require("./customers/customers.module");
const users_module_1 = require("./users/users.module");
const distributeur_module_1 = require("./distributeur/distributeur.module");
const branches_module_1 = require("./branches/branches.module");
const permission_module_1 = require("./permission/permission.module");
const models_module_1 = require("./models/models.module");
const type_model_module_1 = require("./type-model/type-model.module");
const all_parts_module_1 = require("./all-parts/all-parts.module");
const devices_module_1 = require("./devices/devices.module");
const tracability_module_1 = require("./tracability/tracability.module");
const transfert_module_1 = require("./transfert/transfert.module");
const parts_price_module_1 = require("./parts-price/parts-price.module");
const references_module_1 = require("./references/references.module");
const bin_module_1 = require("./bin/bin.module");
const stock_parts_module_1 = require("./stock-parts/stock-parts.module");
const accessory_module_1 = require("./accessory/accessory.module");
const repair_module_1 = require("./repair/repair.module");
const approve_stock_module_1 = require("./approve-stock/approve-stock.module");
const list_fault_module_1 = require("./list-fault/list-fault.module");
const customer_request_module_1 = require("./customer-request/customer-request.module");
const legislation_module_1 = require("./legislation/legislation.module");
const notes_customer_module_1 = require("./notes-customer/notes-customer.module");
const expertise_reasons_module_1 = require("./expertise-reasons/expertise-reasons.module");
const repair_action_module_1 = require("./repair-action/repair-action.module");
const output_list_module_1 = require("./output-list/output-list.module");
const history_repair_module_1 = require("./history-repair/history-repair.module");
const history_stock_part_module_1 = require("./history-stock-part/history-stock-part.module");
const other_cost_module_1 = require("./other-cost/other-cost.module");
const invoice_module_1 = require("./invoice/invoice.module");
const level_repair_module_1 = require("./level-repair/level-repair.module");
const sales_module_1 = require("./sales/sales.module");
const admin_module_1 = require("./admin/admin.module");
const technicien_module_1 = require("./technicien/technicien.module");
const stoc_keeper_module_1 = require("./stoc-keeper/stoc-keeper.module");
const coordinate_module_1 = require("./coordinate/coordinate.module");
const receptionist_module_1 = require("./receptionist/receptionist.module");
const auth_module_1 = require("./auth/auth.module");
const config_1 = require("@nestjs/config");
const notification_module_1 = require("./notification/notification.module");
const schedule_1 = require("@nestjs/schedule");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: 'mtz.123',
                database: 'BEST_Managment_System',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
            company_module_1.CompanyModule,
            brands_module_1.BrandsModule,
            customers_module_1.CustomersModule,
            users_module_1.UsersModule,
            distributeur_module_1.DistributeurModule,
            branches_module_1.BranchesModule,
            permission_module_1.PermissionModule,
            models_module_1.ModelsModule,
            type_model_module_1.TypeModelModule,
            all_parts_module_1.AllPartsModule,
            devices_module_1.DevicesModule,
            tracability_module_1.TracabilityModule,
            transfert_module_1.TransfertModule,
            parts_price_module_1.PartsPriceModule,
            references_module_1.ReferencesModule,
            bin_module_1.BinModule,
            stock_parts_module_1.StockPartsModule,
            accessory_module_1.AccessoryModule,
            repair_module_1.RepairModule,
            approve_stock_module_1.ApproveStockModule,
            list_fault_module_1.ListFaultModule,
            customer_request_module_1.CustomerRequestModule,
            legislation_module_1.LegislationModule,
            notes_customer_module_1.NotesCustomerModule,
            expertise_reasons_module_1.ExpertiseReasonsModule,
            repair_action_module_1.RepairActionModule,
            output_list_module_1.OutputListModule,
            history_repair_module_1.HistoryRepairModule,
            history_stock_part_module_1.HistoryStockPartModule,
            other_cost_module_1.OtherCostModule,
            invoice_module_1.InvoiceModule,
            level_repair_module_1.LevelRepairModule,
            sales_module_1.SalesModule,
            admin_module_1.AdminModule,
            technicien_module_1.TechnicienModule,
            stoc_keeper_module_1.StocKeeperModule,
            coordinate_module_1.CoordinateModule,
            receptionist_module_1.ReceptionistModule,
            auth_module_1.AuthModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            notification_module_1.NotificationModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
        exports: [app_service_1.AppService]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map