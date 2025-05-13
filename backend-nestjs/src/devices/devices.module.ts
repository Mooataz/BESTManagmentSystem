import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([Device, Customer])],
  controllers: [DevicesController],
  providers: [DevicesService, AppService],
})
export class DevicesModule {}
