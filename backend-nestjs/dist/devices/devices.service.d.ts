import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { Customer } from 'src/customers/entities/customer.entity';
import { AppService } from 'src/app.service';
import { Model } from 'src/models/entities/model.entity';
export declare class DevicesService {
    private readonly deviceRepositry;
    private readonly customerRepositry;
    private readonly modelRepositry;
    private appService;
    constructor(deviceRepositry: Repository<Device>, customerRepositry: Repository<Customer>, modelRepositry: Repository<Model>, appService: AppService);
    create(createDeviceDto: CreateDeviceDto): Promise<Device>;
    findAll(): Promise<Device[]>;
    findOne(id: number): Promise<Device>;
    update(id: number, updateDeviceDto: UpdateDeviceDto): Promise<Device>;
    remove(id: number): Promise<Device>;
    filterDevicesByCustomer(customerId: number): Promise<Device[]>;
    filterBySerialNumber(serialNumber: number): Promise<Device[]>;
    filterByModel(model: number): Promise<Device[]>;
    chekDevice(serialenumber?: string, purchaseDate?: string, Fmodel?: number): Promise<Device>;
}
