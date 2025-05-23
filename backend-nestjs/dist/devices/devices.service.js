"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const device_entity_1 = require("./entities/device.entity");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("../customers/entities/customer.entity");
const app_service_1 = require("../app.service");
let DevicesService = class DevicesService {
    deviceRepositry;
    customerRepositry;
    appService;
    constructor(deviceRepositry, customerRepositry, appService) {
        this.deviceRepositry = deviceRepositry;
        this.customerRepositry = customerRepositry;
        this.appService = appService;
    }
    async create(createDeviceDto) {
        if (createDeviceDto.serialeNumber?.length) {
            createDeviceDto.serialeNumber = this.appService.cleanSpaces(createDeviceDto.serialeNumber);
        }
        ;
        const createNew = this.deviceRepositry.create({ ...createDeviceDto });
        return await this.deviceRepositry.save(createNew);
    }
    async findAll() {
        const findAll = await this.deviceRepositry.find();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no devices available");
        }
        return findAll;
    }
    async findOne(id) {
        const findOne = await this.deviceRepositry.findOne({ where: { id } });
        if (!findOne) {
            throw new common_1.NotFoundException("There is no device available");
        }
        return findOne;
    }
    async update(id, updateDeviceDto) {
        const { ...rest } = updateDeviceDto;
        let updateData = { ...rest };
        await this.deviceRepositry.update(id, updateData);
        const updatedDevice = await this.deviceRepositry.findOne({ where: { id }, relations: ['customer'] });
        if (!updatedDevice) {
            throw new common_1.NotFoundException('Device not found for update');
        }
        return updatedDevice;
    }
    async remove(id) {
        const deletedata = await this.deviceRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('Device Not found for delete = failed');
        }
        await this.deviceRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
    async filterDevicesByCustomer(customerId) {
        const findAll = await this.deviceRepositry
            .createQueryBuilder('device')
            .leftJoinAndSelect('device.customer', 'customer')
            .where('customer.id = :customerId', { customerId })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async filterBySerialNumber(serialNumber) {
        const findAll = await this.deviceRepositry
            .createQueryBuilder('device')
            .where('serialeNumber = :serialNumber', { serialNumber })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async filterByModel(model) {
        const findAll = await this.deviceRepositry
            .createQueryBuilder('device')
            .where('model = :model', { model })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async chekDevice(serialenumber, purchaseDate, warrentyProof, model) {
        console.log('Backend: ', serialenumber, ' _ ', purchaseDate, ' _ ', model);
        let device = await this.deviceRepositry
            .createQueryBuilder('devices')
            .where('serialenumber = :serialenumber', { serialenumber })
            .getOne();
        if (!device) {
            device = this.deviceRepositry.create({ serialenumber, purchaseDate, warrentyProof, model: { id: model } });
            await this;
            this.deviceRepositry.save(device);
        }
        return device;
    }
};
exports.DevicesService = DevicesService;
exports.DevicesService = DevicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        app_service_1.AppService])
], DevicesService);
//# sourceMappingURL=devices.service.js.map