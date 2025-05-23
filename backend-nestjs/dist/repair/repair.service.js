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
exports.RepairService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const repair_entity_1 = require("./entities/repair.entity");
const accessory_entity_1 = require("../accessory/entities/accessory.entity");
const list_fault_entity_1 = require("../list-fault/entities/list-fault.entity");
const customer_request_entity_1 = require("../customer-request/entities/customer-request.entity");
const notes_customer_entity_1 = require("../notes-customer/entities/notes-customer.entity");
const expertise_reason_entity_1 = require("../expertise-reasons/entities/expertise-reason.entity");
const repair_action_entity_1 = require("../repair-action/entities/repair-action.entity");
const app_service_1 = require("../app.service");
const device_entity_1 = require("../devices/entities/device.entity");
const user_entity_1 = require("../users/entities/user.entity");
const stock_part_entity_1 = require("../stock-parts/entities/stock-part.entity");
const approve_stock_entity_1 = require("../approve-stock/entities/approve-stock.entity");
const customer_entity_1 = require("../customers/entities/customer.entity");
let RepairService = class RepairService {
    repairRepositry;
    accessoryRepositry;
    listFaultRepositry;
    customerRequestRepositry;
    notesCustomerRepositry;
    expertiseReasonRepositry;
    repairActionRepositry;
    deviceRepositry;
    userRepositry;
    stockPartRepositry;
    approveStockRepositry;
    CustomerStockRepositry;
    appService;
    constructor(repairRepositry, accessoryRepositry, listFaultRepositry, customerRequestRepositry, notesCustomerRepositry, expertiseReasonRepositry, repairActionRepositry, deviceRepositry, userRepositry, stockPartRepositry, approveStockRepositry, CustomerStockRepositry, appService) {
        this.repairRepositry = repairRepositry;
        this.accessoryRepositry = accessoryRepositry;
        this.listFaultRepositry = listFaultRepositry;
        this.customerRequestRepositry = customerRequestRepositry;
        this.notesCustomerRepositry = notesCustomerRepositry;
        this.expertiseReasonRepositry = expertiseReasonRepositry;
        this.repairActionRepositry = repairActionRepositry;
        this.deviceRepositry = deviceRepositry;
        this.userRepositry = userRepositry;
        this.stockPartRepositry = stockPartRepositry;
        this.approveStockRepositry = approveStockRepositry;
        this.CustomerStockRepositry = CustomerStockRepositry;
        this.appService = appService;
    }
    async create(createRepairDto) {
        const accessory = await this.accessoryRepositry.find({
            where: { id: (0, typeorm_1.In)(createRepairDto.accessoryIds ?? []) }
        });
        const listFault = await this.listFaultRepositry.find({
            where: { id: (0, typeorm_1.In)(createRepairDto.listFaultIds ?? []) }
        });
        const customerRequest = await this.customerRequestRepositry.find({
            where: { id: (0, typeorm_1.In)(createRepairDto.customerRequestIds ?? []) }
        });
        const notesCustomer = await this.notesCustomerRepositry.find({
            where: { id: (0, typeorm_1.In)(createRepairDto.notesCustomerIds ?? []) }
        });
        const expertiseReason = await this.expertiseReasonRepositry.find({
            where: { id: (0, typeorm_1.In)(createRepairDto.expertiseReasonsIds ?? []) }
        });
        const repairAction = await this.repairActionRepositry.find({
            where: { id: (0, typeorm_1.In)(createRepairDto.repairActionIds ?? []) }
        });
        const device = await this.deviceRepositry.findOne({
            where: { id: createRepairDto.device }
        });
        const user = await this.userRepositry.findOne({
            where: { id: createRepairDto.user }
        });
        if (!listFault.length)
            throw new common_1.NotFoundException('No Fault found');
        if (!device)
            throw new common_1.NotFoundException('Device not found');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const repairData = {
            warrenty: createRepairDto.warrenty ?? false,
            approveRepair: createRepairDto.approveRepair ?? false,
            newSerialNumber: createRepairDto.newSerialNumber ?? '',
            advancePayment: createRepairDto.advancePayment,
            actuellyBranch: createRepairDto.actuellyBranch,
            files: createRepairDto.files,
            remark: createRepairDto.remark,
            deviceStateReceive: createRepairDto.deviceStateReceive,
            partsNeed: createRepairDto.partsNeed,
            accessory,
            listFault,
            customerRequest,
            notesCustomer,
            expertiseReason,
            repairAction,
            device,
            user
        };
        const newCreate = this.repairRepositry.create(repairData);
        return await this.repairRepositry.save(newCreate);
    }
    async findAll() {
        const allfind = await this.repairRepositry.find();
        if (!allfind || allfind.length === 0) {
            throw new common_1.NotFoundException('There is no data available');
        }
        return allfind;
    }
    async findOne(id) {
        const onefind = await this.repairRepositry.findOne({ where: { id } });
        if (!onefind) {
            throw new common_1.NotFoundException('No data available');
        }
        return onefind;
    }
    async update(id, updateRepairDto) {
        const existingRepair = await this.repairRepositry.findOne({ where: { id } });
        if (!existingRepair) {
            throw new common_1.NotFoundException('Repair not found');
        }
        let device = undefined;
        if (updateRepairDto.device !== undefined) {
            const foundDevice = await this.deviceRepositry.findOne({ where: { id: updateRepairDto.device } });
            if (!foundDevice) {
                throw new common_1.NotFoundException('Device not found');
            }
            device = foundDevice;
        }
        let user = undefined;
        if (updateRepairDto.user !== undefined) {
            const foundUser = await this.userRepositry.findOne({ where: { id: updateRepairDto.user } });
            if (!foundUser) {
                throw new common_1.NotFoundException('User not found');
            }
            user = foundUser;
        }
        let customer = undefined;
        if (updateRepairDto.customer !== undefined) {
            const foundCustomer = await this.CustomerStockRepositry.findOne({ where: { id: updateRepairDto.customer } });
            if (!foundCustomer) {
                throw new common_1.NotFoundException('Customer not found');
            }
            customer = foundCustomer;
        }
        const updateData = {
            ...updateRepairDto,
            device: device ?? existingRepair.device,
            user: user ?? existingRepair.user,
            customer: customer ?? existingRepair.customer
        };
        delete updateData.device;
        delete updateData.user;
        delete updateData.customer;
        await this.repairRepositry.update(id, updateData);
        return this.repairRepositry.findOneOrFail({
            where: { id },
            relations: ['device', 'user']
        });
    }
    async remove(id) {
        const deletedata = await this.repairRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('data Not found for delete');
        }
        await this.repairRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
    async filterRepairByDevice(deviceId) {
        return this.repairRepositry
            .createQueryBuilder('repair')
            .leftJoinAndSelect('repair.device', 'device')
            .where('device.id = :deviceId', { deviceId })
            .getMany();
    }
    async filterRepairByUser(userId) {
        return this.repairRepositry
            .createQueryBuilder('repair')
            .leftJoinAndSelect('repair.user', 'user')
            .where('user.id = :userId', { userId })
            .getMany();
    }
    async filterByNewSerialNumber(newSerialNumber) {
        const findAll = await this.repairRepositry
            .createQueryBuilder('repair')
            .where('newSerialNumber = :newSerialNumber', { newSerialNumber })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async filterByActuellyBranch(actuellyBranch) {
        const findAll = await this.repairRepositry
            .createQueryBuilder('repair')
            .where('actuellyBranch = :actuellyBranch', { actuellyBranch })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async updateRepairWithParts(repairId, updateData) {
        const repair = await this.repairRepositry.findOne({
            where: { id: repairId },
            relations: ['approveStock'],
        });
        if (!repair) {
            throw new common_1.NotFoundException('Repair not found');
        }
        if (updateData.device && typeof updateData.device === 'number') {
            const device = await this.deviceRepositry.findOneBy({ id: updateData.device });
            if (!device)
                throw new common_1.NotFoundException('Device not found');
            repair.device = device;
        }
        if (updateData.user && typeof updateData.user === 'number') {
            const user = await this.userRepositry.findOneBy({ id: updateData.user });
            if (!user)
                throw new common_1.NotFoundException('User not found');
            repair.user = user;
        }
        const previousParts = repair.partsNeed || [];
        const newParts = updateData.partsNeed || [];
        const addedParts = newParts.filter(p => !previousParts.includes(p));
        const { device, user, ...restData } = updateData;
        Object.assign(repair, restData);
        const updatedRepair = await this.repairRepositry.save(repair);
        if (repair.approveRepair === true) {
            for (const partId of addedParts) {
                const approveStock = this.approveStockRepositry.create({
                    type: 'Repair',
                    date: new Date(),
                    state: 'pending',
                    idPartRepair: partId,
                    repair: updatedRepair,
                });
                await this.approveStockRepositry.save(approveStock);
            }
        }
        return updatedRepair;
    }
};
exports.RepairService = RepairService;
exports.RepairService = RepairService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(repair_entity_1.Repair)),
    __param(1, (0, typeorm_2.InjectRepository)(accessory_entity_1.Accessory)),
    __param(2, (0, typeorm_2.InjectRepository)(list_fault_entity_1.ListFault)),
    __param(3, (0, typeorm_2.InjectRepository)(customer_request_entity_1.CustomerRequest)),
    __param(4, (0, typeorm_2.InjectRepository)(notes_customer_entity_1.NotesCustomer)),
    __param(5, (0, typeorm_2.InjectRepository)(expertise_reason_entity_1.ExpertiseReason)),
    __param(6, (0, typeorm_2.InjectRepository)(repair_action_entity_1.RepairAction)),
    __param(7, (0, typeorm_2.InjectRepository)(device_entity_1.Device)),
    __param(8, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(9, (0, typeorm_2.InjectRepository)(stock_part_entity_1.StockPart)),
    __param(10, (0, typeorm_2.InjectRepository)(approve_stock_entity_1.ApproveStock)),
    __param(11, (0, typeorm_2.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        app_service_1.AppService])
], RepairService);
//# sourceMappingURL=repair.service.js.map