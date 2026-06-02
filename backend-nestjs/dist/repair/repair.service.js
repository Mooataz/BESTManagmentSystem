"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const device_entity_1 = require("../devices/entities/device.entity");
const user_entity_1 = require("../users/entities/user.entity");
const stock_part_entity_1 = require("../stock-parts/entities/stock-part.entity");
const approve_stock_entity_1 = require("../approve-stock/entities/approve-stock.entity");
const customer_entity_1 = require("../customers/entities/customer.entity");
const history_repair_entity_1 = require("../history-repair/entities/history-repair.entity");
const tracability_entity_1 = require("../tracability/entities/tracability.entity");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
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
    customerRepositry;
    historyRepairRepositry;
    tracabilityRepositry;
    constructor(repairRepositry, accessoryRepositry, listFaultRepositry, customerRequestRepositry, notesCustomerRepositry, expertiseReasonRepositry, repairActionRepositry, deviceRepositry, userRepositry, stockPartRepositry, approveStockRepositry, customerRepositry, historyRepairRepositry, tracabilityRepositry) {
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
        this.customerRepositry = customerRepositry;
        this.historyRepairRepositry = historyRepairRepositry;
        this.tracabilityRepositry = tracabilityRepositry;
    }
    async create(createRepairDto, userId) {
        const accessory = await this.accessoryRepositry.find({
            where: { id: (0, typeorm_1.In)(createRepairDto.accessoryIds ?? []) }
        });
        const listFault = await this.listFaultRepositry.find({
            where: { id: (0, typeorm_1.In)(createRepairDto.listFaultIds ?? []) }
        });
        const customerRequest = await this.customerRequestRepositry.find({
            where: { id: (0, typeorm_1.In)(createRepairDto.customerRequestIds ?? []) }
        });
        const device = await this.deviceRepositry.findOne({
            where: { id: createRepairDto.device }
        });
        const customer = await this.customerRepositry.findOne({
            where: { id: createRepairDto.customer }
        });
        if (!listFault.length)
            throw new common_1.NotFoundException('No Fault found');
        if (!device)
            throw new common_1.NotFoundException('Device not found');
        const repairData = {
            actuellybranch: createRepairDto.actuellybranch,
            remark: createRepairDto.remark,
            deviceStateReceive: createRepairDto.deviceStateReceive,
            accessory,
            listFault,
            customerRequest,
            device: { id: createRepairDto.device },
            customer: { id: createRepairDto.customer },
        };
        const newCreate = this.repairRepositry.create(repairData);
        const savedRepair = await this.repairRepositry.save(newCreate);
        const history = this.historyRepairRepositry.create({
            date: new Date(),
            step: 'Création',
            repair: { id: savedRepair.id },
        });
        const savedHistory = await this.historyRepairRepositry.save(history);
        const tracability = this.tracabilityRepositry.create({
            historyRepair: { id: savedHistory.id },
            user: { id: userId },
        });
        await this.tracabilityRepositry.save(tracability);
        return savedRepair;
    }
    async findAll() {
        const allfind = await this.repairRepositry.find({
            relations: ['customer', 'customer.distributer',
                'device', 'device.model', 'device.model.brand', 'device.model.allpart', 'device.model.typeModel',
                'accessory',
                'listFault',
                'customerRequest',
                'notesCustomer',
                'expertiseReason',
                'repairAction',
                'user',
                'approveStock',
                'outputList',
                'transfert',
                'invoice',
                'historyRepair', 'historyRepair.tracability', 'historyRepair.tracability.user', 'historyRepair.tracability.user.branch', 'historyRepair.tracability.user.branch.company'],
        });
        if (!allfind || allfind.length === 0) {
            throw new common_1.NotFoundException('There is no data available');
        }
        return allfind;
    }
    async findOne(id) {
        const onefind = await this.repairRepositry.findOne({
            where: { id },
            relations: ['customer', 'customer.distributer',
                'device', 'device.model', 'device.model.brand', 'device.model.allpart', 'device.model.typeModel',
                'accessory',
                'listFault',
                'customerRequest',
                'notesCustomer',
                'expertiseReason',
                'repairAction',
                'user',
                'approveStock',
                'outputList',
                'transfert',
                'invoice',
                'historyRepair', 'historyRepair.tracability', 'historyRepair.tracability.user', 'historyRepair.tracability.user.branch', 'historyRepair.tracability.user.branch.company'],
        });
        if (!onefind) {
            throw new common_1.NotFoundException('No data available');
        }
        return onefind;
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
        const findAll = await this.repairRepositry.find({
            where: {
                actuellybranch: actuellyBranch,
            },
            relations: [
                'customer', 'customer.distributer',
                'device', 'device.model', 'device.model.brand',
                'accessory',
                'listFault',
                'customerRequest',
                'historyRepair',
                'historyRepair.tracability',
                'historyRepair.tracability.user',
                'historyRepair.tracability.user.branch',
                'historyRepair.tracability.user.branch.company'
            ], order: {
                id: 'DESC'
            }
        });
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findByBranchAndStep(branchId, step) {
        const allRepairs = await this.repairRepositry.find({
            where: {
                actuellybranch: branchId
            },
            relations: [
                'customer', 'customer.distributer',
                'device', 'device.model', 'device.model.brand',
                'accessory',
                'listFault',
                'customerRequest',
                'historyRepair',
                'historyRepair.tracability',
                'historyRepair.tracability.user',
                'historyRepair.tracability.user.branch',
                'historyRepair.tracability.user.branch.company',
                'user'
            ],
            order: {
                historyRepair: {
                    date: 'DESC'
                }
            }
        });
        const filtered = allRepairs.filter(repair => {
            const history = repair.historyRepair;
            if (!history || history.length === 0)
                return false;
            const lastStep = history[0].step;
            return lastStep === step;
        });
        return filtered;
    }
    async FiltreByUserStep(userId, steps) {
        const filtreuserId = await this.repairRepositry.find({
            where: {
                user: { id: userId },
            },
            relations: [
                'customer', 'customer.distributer',
                'device', 'device.model', 'device.model.brand',
                'accessory',
                'listFault',
                'customerRequest',
                'historyRepair',
                'historyRepair.tracability',
                'historyRepair.tracability.user',
                'historyRepair.tracability.user.branch',
                'historyRepair.tracability.user.branch.company',
                'user'
            ],
            order: {
                historyRepair: {
                    date: 'DESC'
                }
            }
        });
        const filtered = filtreuserId.filter(repair => {
            const history = repair.historyRepair;
            if (!history || history.length === 0)
                return false;
            const lastStep = history[0].step;
            return lastStep === steps;
        });
        return filtered;
    }
    async update(id, updateRepairDto) {
        if (!updateRepairDto || typeof updateRepairDto !== 'object') {
            throw new common_1.BadRequestException('Invalid update data');
        }
        const existingRepair = await this.repairRepositry.findOne({
            where: { id },
            relations: [
                'device', 'user', 'customer',
                'accessory', 'listFault', 'customerRequest',
                'notesCustomer', 'expertiseReason', 'repairAction'
            ]
        });
        if (!existingRepair) {
            throw new common_1.NotFoundException('Repair not found');
        }
        if (updateRepairDto.expertiseReason) {
            existingRepair.expertiseReason =
                await this.expertiseReasonRepositry.findBy({
                    id: (0, typeorm_1.In)(updateRepairDto.expertiseReason),
                });
        }
        const parseIfString = (value) => typeof value === 'string' ? JSON.parse(value) : value;
        if (updateRepairDto.repairAction) {
            existingRepair.repairAction =
                await this.repairActionRepositry.findBy({
                    id: (0, typeorm_1.In)(updateRepairDto.repairAction),
                });
        }
        if (updateRepairDto.notesCustomer) {
            existingRepair.notesCustomer =
                await this.notesCustomerRepositry.findBy({
                    id: (0, typeorm_1.In)(updateRepairDto.notesCustomer),
                });
        }
        if (updateRepairDto.partsNeed) {
            existingRepair.partsNeed = updateRepairDto.partsNeed;
        }
        updateRepairDto.accessoryIds = parseIfString(updateRepairDto?.accessoryIds);
        updateRepairDto.listFaultIds = parseIfString(updateRepairDto?.listFaultIds);
        updateRepairDto.customerRequestIds = parseIfString(updateRepairDto?.customerRequestIds);
        updateRepairDto.notesCustomer = parseIfString(updateRepairDto?.notesCustomer);
        updateRepairDto.expertiseReason = parseIfString(updateRepairDto?.expertiseReason);
        updateRepairDto.repairAction = parseIfString(updateRepairDto?.repairAction);
        updateRepairDto.partsNeed = parseIfString(updateRepairDto?.partsNeed);
        updateRepairDto.device = parseIfString(updateRepairDto?.device);
        updateRepairDto.user = parseIfString(updateRepairDto?.user);
        updateRepairDto.customer = parseIfString(updateRepairDto?.customer);
        if (updateRepairDto.device !== undefined) {
            existingRepair.device = await this.deviceRepositry.findOneByOrFail({ id: updateRepairDto.device });
        }
        if (updateRepairDto.user !== undefined) {
            existingRepair.user = await this.userRepositry.findOneByOrFail({ id: updateRepairDto.user });
        }
        if (updateRepairDto.customer !== undefined) {
            existingRepair.customer = await this.customerRepositry.findOneByOrFail({ id: updateRepairDto.customer });
        }
        if (updateRepairDto.accessoryIds) {
            existingRepair.accessory = await this.accessoryRepositry.findBy({ id: (0, typeorm_1.In)(updateRepairDto.accessoryIds) });
        }
        if (updateRepairDto.listFaultIds) {
            existingRepair.listFault = await this.listFaultRepositry.findBy({ id: (0, typeorm_1.In)(updateRepairDto.listFaultIds) });
        }
        if (updateRepairDto.customerRequestIds) {
            existingRepair.customerRequest = await this.customerRequestRepositry.findBy({ id: (0, typeorm_1.In)(updateRepairDto.customerRequestIds) });
        }
        if (updateRepairDto.notesCustomer) {
            existingRepair.notesCustomer = await this.notesCustomerRepositry.findBy({ id: (0, typeorm_1.In)(updateRepairDto.notesCustomer) });
        }
        if (updateRepairDto.expertiseReason) {
            existingRepair.expertiseReason = await this.expertiseReasonRepositry.findBy({ id: (0, typeorm_1.In)(updateRepairDto.expertiseReason) });
        }
        if (updateRepairDto.repairAction) {
            existingRepair.repairAction = await this.repairActionRepositry.findBy({ id: (0, typeorm_1.In)(updateRepairDto.repairAction) });
        }
        const simpleFields = [
            'warrenty', 'approveRepair', 'newSerialNumber', 'remark',
            'deviceStateReceive', 'files', 'partsNeed', 'actuellybranch'
        ];
        for (const field of simpleFields) {
            if (updateRepairDto[field] !== undefined) {
                existingRepair[field] = updateRepairDto[field];
            }
        }
        await this.repairRepositry.save(existingRepair);
        const finalPartIds = (Array.isArray(existingRepair.partsNeed) ? existingRepair.partsNeed : []).map(Number);
        const existingEntries = await this.approveStockRepositry.find({
            where: { repair: { id } },
        });
        const existingPartIds = existingEntries.map(e => Number(e.idPartRepair));
        const toDelete = existingEntries.filter(e => !finalPartIds.includes(Number(e.idPartRepair)));
        if (toDelete.length > 0) {
            await this.approveStockRepositry.remove(toDelete);
        }
        const toCreate = finalPartIds.filter(id => !existingPartIds.includes(id));
        if (toCreate.length > 0) {
            const entries = toCreate.map(partId => ({
                type: existingRepair.repairAction?.some(a => a.name === 'Nouvelle appareille') ? 'Nouvelle appareille' : 'Réparation',
                date: new Date(),
                state: 'En cours',
                idPartRepair: partId,
                repair: { id },
            }));
            await this.approveStockRepositry.save(entries);
        }
        return this.repairRepositry.findOneOrFail({
            where: { id },
            relations: [
                'customer', 'customer.distributer',
                'device', 'device.model', 'device.model.brand', 'device.model.allpart', 'device.model.typeModel',
                'accessory',
                'listFault',
                'customerRequest',
                'notesCustomer',
                'expertiseReason',
                'repairAction',
                'approveStock',
                'user',
            ],
        });
    }
    async removeFile(id, fileName) {
        const repair = await this.repairRepositry.findOne({ where: { id } });
        if (!repair)
            throw new common_1.NotFoundException('Repair not found');
        const files = (repair.files ?? []);
        if (!files.includes(fileName)) {
            throw new common_1.NotFoundException(`File ${fileName} not found in repair ${id}`);
        }
        const filePath = path.join(process.cwd(), 'upload/repairs', fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        repair.files = files.filter(f => f !== fileName);
        return await this.repairRepositry.save(repair);
    }
    async updateRepairWithParts(id, updateRepairDto, files) {
        const repair = await this.repairRepositry.findOne({ where: { id } });
        if (!repair) {
            throw new common_1.NotFoundException(`Repair with id ${id} not found`);
        }
        if (files && files.length > 0) {
            if (Array.isArray(repair.files)) {
                for (const oldFile of repair.files) {
                    const filePath = path.join(process.cwd(), 'upload/repairs', oldFile);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            }
            repair.files = files;
        }
        Object.entries(updateRepairDto || {}).forEach(([key, value]) => {
            if (value !== undefined) {
                repair[key] = value;
            }
        });
        await this.repairRepositry.save(repair);
        return this.repairRepositry.findOneOrFail({
            where: { id },
            relations: [
                'customer', 'customer.distributer',
                'device', 'device.model', 'device.model.brand', 'device.model.allpart', 'device.model.typeModel',
                'accessory',
                'listFault',
                'customerRequest',
                'notesCustomer',
                'expertiseReason',
                'repairAction',
                'user',
            ],
        });
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
    __param(12, (0, typeorm_2.InjectRepository)(history_repair_entity_1.HistoryRepair)),
    __param(13, (0, typeorm_2.InjectRepository)(tracability_entity_1.Tracability)),
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
        typeorm_1.Repository,
        typeorm_1.Repository])
], RepairService);
//# sourceMappingURL=repair.service.js.map