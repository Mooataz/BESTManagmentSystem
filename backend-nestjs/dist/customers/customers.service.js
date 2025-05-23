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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const customer_entity_1 = require("./entities/customer.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const app_service_1 = require("../app.service");
let CustomersService = class CustomersService {
    customerRepositry;
    appService;
    constructor(customerRepositry, appService) {
        this.customerRepositry = customerRepositry;
        this.appService = appService;
    }
    async create(createCustomerDto) {
        createCustomerDto.name = this.appService.cleanSpaces(createCustomerDto.name);
        return await this.customerRepositry.save(createCustomerDto);
    }
    async findAll() {
        const allCustomers = await this.customerRepositry.find();
        if (!allCustomers || allCustomers.length === 0) {
            throw new common_1.NotFoundException("There is no Customers data Available");
        }
        return allCustomers;
    }
    async findOne(id) {
        const OneCustomer = await this.customerRepositry.findOne({ where: { id } });
        if (!OneCustomer) {
            throw new common_1.NotFoundException("There is no Customer data Available");
        }
        return OneCustomer;
    }
    async update(id, updateCustomerDto) {
        await this.customerRepositry.update(id, updateCustomerDto);
        const updatedata = await this.customerRepositry.findOne({ where: { id } });
        if (!updatedata) {
            throw new common_1.NotFoundException('Customer Not found for update = failed');
        }
        return updatedata;
    }
    async remove(id) {
        const deletedata = await this.customerRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('user Not found for delete = failed');
        }
        await this.customerRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
    async findByDistributer(distributerId) {
        const findAll = await this.customerRepositry
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.distributer', 'distributer')
            .where('distributer.id = :distributerId', { distributerId })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findByPhone(phone) {
        const findAll = await this.customerRepositry
            .createQueryBuilder('customer')
            .where('phone = :phone', { phone })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findByName(name, phone, distributer) {
        let customer = await this.customerRepositry
            .createQueryBuilder('customer')
            .where('name = :name', { name })
            .andWhere('phone = :phone', { phone })
            .getOne();
        if (!customer) {
            customer = this.customerRepositry.create({ name, phone, distributer });
            await this.customerRepositry.save(customer);
        }
        return customer;
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        app_service_1.AppService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map