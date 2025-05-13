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
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const invoice_entity_1 = require("./entities/invoice.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const repair_entity_1 = require("../repair/entities/repair.entity");
const user_entity_1 = require("../users/entities/user.entity");
const other_cost_entity_1 = require("../other-cost/entities/other-cost.entity");
let InvoiceService = class InvoiceService {
    invoiceRepositry;
    repairRepositry;
    userRepositry;
    otherCostRepositry;
    constructor(invoiceRepositry, repairRepositry, userRepositry, otherCostRepositry) {
        this.invoiceRepositry = invoiceRepositry;
        this.repairRepositry = repairRepositry;
        this.userRepositry = userRepositry;
        this.otherCostRepositry = otherCostRepositry;
    }
    async create(createInvoiceDto) {
        const otherCost = await this.otherCostRepositry.find({ where: { id: (0, typeorm_1.In)(createInvoiceDto.otherCost) }, });
        const repair = await this.repairRepositry.findOne({ where: { id: createInvoiceDto.repair }, });
        if (!repair) {
            throw new common_1.NotFoundException(`repair with ID ${createInvoiceDto.repair} not found`);
        }
        const user = await this.userRepositry.findOne({ where: { id: createInvoiceDto.user }, });
        if (!user) {
            throw new common_1.NotFoundException(`user with ID ${createInvoiceDto.user} not found`);
        }
        const newCreate = await this.invoiceRepositry.create({ ...createInvoiceDto, otherCost: otherCost || undefined, repair, user });
        return await this.invoiceRepositry.save(newCreate);
    }
    async findAll() {
        const allfind = await this.invoiceRepositry.find();
        if (!allfind || allfind.length === 0) {
            throw new common_1.NotFoundException("There is no data available");
        }
        return allfind;
    }
    async findOne(id) {
        const Onefind = await this.invoiceRepositry.findOne({ where: { id } });
        if (!Onefind) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return Onefind;
    }
    async update(id, updateInvoiceDto) {
        const { otherCost, repair, user, ...rest } = updateInvoiceDto;
        let updateData = { ...rest };
        if (updateInvoiceDto.otherCost !== undefined) {
            const otherCost = await this.otherCostRepositry.find({ where: { id: (0, typeorm_1.In)(updateInvoiceDto.otherCost) } });
            updateData.otherCost = otherCost;
        }
        if (updateInvoiceDto.repair !== undefined) {
            const repair = await this.repairRepositry.findOne({ where: { id: updateInvoiceDto.repair } });
            if (!repair) {
                throw new common_1.NotFoundException('No repair found');
            }
            updateData.repair = repair;
        }
        if (updateInvoiceDto.repair !== undefined) {
            const user = await this.userRepositry.findOne({ where: { id: updateInvoiceDto.user } });
            if (!user) {
                throw new common_1.NotFoundException('No user found');
            }
            updateData.user = user;
        }
        await this.invoiceRepositry.update(id, updateData);
        const updatedInvoice = await this.invoiceRepositry.findOne({ where: { id }, relations: ['repair', 'user', 'otherCost'] });
        if (!updatedInvoice) {
            throw new common_1.NotFoundException('Reference not found to update');
        }
        return updatedInvoice;
    }
    async remove(id) {
        const deletedata = await this.invoiceRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('data Not found for delete = failed');
        }
        await this.invoiceRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
    async findByBranchId(branchId) {
        const findAll = await this.invoiceRepositry
            .createQueryBuilder("invoice")
            .leftJoinAndSelect("invoice.repair", "repair")
            .where("repair.actuellyBranch = :branchId", { branchId })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findByUserId(userId) {
        const findAll = await this.invoiceRepositry
            .createQueryBuilder("invoice")
            .leftJoinAndSelect("invoice.repair", "repair")
            .where("repair.user = :userId", { userId })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findByRepairId(repairId) {
        const findAll = await this.invoiceRepositry
            .createQueryBuilder("invoice")
            .leftJoinAndSelect("invoice.repair", "repair")
            .where("repair.id = :repairId", { repairId })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findByState(state) {
        const findAll = await this.invoiceRepositry
            .createQueryBuilder("invoice")
            .where("state = :state", { state })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(invoice_entity_1.Invoice)),
    __param(1, (0, typeorm_2.InjectRepository)(repair_entity_1.Repair)),
    __param(2, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_2.InjectRepository)(other_cost_entity_1.OtherCost)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map