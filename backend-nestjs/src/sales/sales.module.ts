import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { ApproveStock } from 'src/approve-stock/entities/approve-stock.entity';
import { User } from 'src/users/entities/user.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { PartsPrice } from 'src/parts-price/entities/parts-price.entity';
import { Bin } from 'src/bin/entities/bin.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, AllPart, ApproveStock, User, StockPart, PartsPrice, Bin, Customer, Company])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
