import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { In, Repository } from 'typeorm';
import { Customer } from 'src/customers/entities/customer.entity';
import { AppService } from 'src/app.service';
import { Model } from 'src/models/entities/model.entity';

@Injectable()
export class DevicesService {
  constructor(@InjectRepository(Device) private readonly deviceRepositry: Repository<Device>,
    @InjectRepository(Customer) private readonly customerRepositry: Repository<Customer>,
    @InjectRepository(Model) private readonly modelRepositry: Repository<Model>,
    private appService: AppService
  ) { }

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    if (createDeviceDto.serialenumber?.length) { 
    createDeviceDto.serialenumber = this.appService.cleanSpaces(createDeviceDto.serialenumber) };
   
    const createNew = this.deviceRepositry.create({ ...createDeviceDto    })

    return await this.deviceRepositry.save(createNew);
  }

  async findAll(): Promise<Device[]> {
    const findAll = await this.deviceRepositry.find()
    if (!findAll || findAll.length === 0) {
      throw new NotFoundException("There is no devices available")
    }
    return findAll
  }

  async findOne(id: number): Promise<Device> {
    const findOne = await this.deviceRepositry.findOne({ where: { id } })
    if (!findOne) {
      throw new NotFoundException("There is no device available")
    }
    return findOne
  }

 
  async update(id: number, updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    const {  ...rest } = updateDeviceDto;
    let updateData: Partial<Device> = { ...rest };
 

    await this.deviceRepositry.update(id, updateData);

    const updatedDevice = await this.deviceRepositry.findOne({ where: { id }, relations: ['customer'] });

    if (!updatedDevice) {
      throw new NotFoundException('Device not found for update');
    }

    return updatedDevice;
  }

  async remove(id: number): Promise<Device> {
    const deletedata = await this.deviceRepositry.findOne({ where: { id } });
    if (!deletedata) {
      throw new NotFoundException('Device Not found for delete = failed')
    }
    await this.deviceRepositry.delete({ id: deletedata.id })
    return deletedata;
  }

  async filterDevicesByCustomer(customerId: number): Promise<Device[]> {
    const findAll = await this.deviceRepositry
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.customer', 'customer')
      .where('customer.id = :customerId', { customerId })
      .getMany();
      if (!findAll || findAll.length === 0) {
        throw new NotFoundException("There is no data Available") }
  return findAll
  }

  async filterBySerialNumber(serialNumber: number): Promise<Device[]> {
    const findAll = await  this.deviceRepositry
      .createQueryBuilder('device')
      .where('serialeNumber = :serialNumber', { serialNumber })
      .getMany();
      if (!findAll || findAll.length === 0) {
        throw new NotFoundException("There is no data Available") }
  return findAll
  }

  async filterByModel(model: number): Promise<Device[]> {
    const findAll = await this.deviceRepositry
      .createQueryBuilder('device')
      .where('model = :model', { model })
      .getMany();
      if (!findAll || findAll.length === 0) {
        throw new NotFoundException("There is no data Available") }
  return findAll
  }

  async chekDevice (serialenumber?:string, 
                    purchaseDate?:string, 
                    
                    Fmodel?:number):Promise<Device> {
     let device: Device | null;

   
    device = await this.deviceRepositry
      .createQueryBuilder('devices')
      .where('serialenumber = :serialenumber', { serialenumber })
      .getOne();
  

 let model: Model | null = null;

if (Fmodel) {
  model = await this.modelRepositry.findOne({ where: { id: Fmodel } });
}

 const deviceData: Partial<Device> = {
  serialenumber,
   
   
};
if (purchaseDate) {
  deviceData.purchaseDate = new Date(purchaseDate);
}
if (model) {
  deviceData.model = model;
}

device = this.deviceRepositry.create(deviceData);

    await this.deviceRepositry.save(device);
   

    return device
  }


  async findAllWithRepairs(): Promise<Device[]> {
    return await this.deviceRepositry.find({
      relations: [
        'model', 'model.brand', 'model.typeModel',
        'repair', 'repair.customer', 'repair.customer.distributer',
        'repair.historyRepair',
        'repair.historyRepair.tracability',
        'repair.historyRepair.tracability.user',
        'repair.historyRepair.tracability.user.branch',
        'repair.repairAction',
        'repair.listFault',
      ],
      order: { id: 'DESC' },
    });
  }

  async deviceHasOpenRepair(serialNumber: string): Promise<boolean> {
  const device = await this.deviceRepositry.findOne({
    where: { serialenumber: serialNumber },
    relations: ['repair', 'repair.historyRepair'],
  });

  if (!device || !device.repair || device.repair.length === 0) {
    return false;
  }

  for (const rep of device.repair) {
    if (rep.historyRepair && rep.historyRepair.length > 0) {
      const sortedHistory = rep.historyRepair.sort(
        (a, b) =>
          (b.date?.getTime() ?? 0) -
          (a.date?.getTime() ?? 0),
      );

      const lastStep = sortedHistory[0].step;

      if (lastStep !== 'Récupérer') {
        return true; // réparation en cours
      }
    }
  }

  return false;
}



}
