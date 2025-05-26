import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
export declare class DevicesController {
    private readonly devicesService;
    constructor(devicesService: DevicesService);
    create(createDeviceDto: CreateDeviceDto, res: any): Promise<any>;
    findAll(res: any): Promise<any>;
    findOne(id: number, res: any): Promise<any>;
    update(id: number, updateDeviceDto: UpdateDeviceDto, res: any): Promise<any>;
    remove(id: number, res: any): Promise<any>;
    checkDevice(body: {
        serialenumber?: string;
        purchaseDate?: string;
        model?: number;
    }, res: any): Promise<any>;
}
