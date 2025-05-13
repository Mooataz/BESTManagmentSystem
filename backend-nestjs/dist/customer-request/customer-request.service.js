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
exports.CustomerRequestService = void 0;
const common_1 = require("@nestjs/common");
const customer_request_entity_1 = require("./entities/customer-request.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const app_service_1 = require("../app.service");
let CustomerRequestService = class CustomerRequestService {
    customerRequestRepositry;
    appService;
    constructor(customerRequestRepositry, appService) {
        this.customerRequestRepositry = customerRequestRepositry;
        this.appService = appService;
    }
    async create(createCustomerRequestDto) {
        createCustomerRequestDto.name = this.appService.cleanSpaces(createCustomerRequestDto.name);
        return await this.customerRequestRepositry.save(createCustomerRequestDto);
    }
    async findAll() {
        const allfind = await this.customerRequestRepositry.find();
        if (!allfind || allfind.length === 0) {
            throw new common_1.NotFoundException("There is no data available");
        }
        return allfind;
    }
    async findOne(id) {
        const Onefind = await this.customerRequestRepositry.findOne({ where: { id } });
        if (!Onefind) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return Onefind;
    }
    async update(id, updateCustomerRequestDto) {
        await this.customerRequestRepositry.update(id, updateCustomerRequestDto);
        const updatedata = await this.customerRequestRepositry.findOne({ where: { id } });
        if (!updatedata) {
            throw new common_1.NotFoundException('data Not found for update = failed');
        }
        return updatedata;
    }
    async remove(id) {
        const deletedata = await this.customerRequestRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('data Not found for delete = failed');
        }
        await this.customerRequestRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
};
exports.CustomerRequestService = CustomerRequestService;
exports.CustomerRequestService = CustomerRequestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(customer_request_entity_1.CustomerRequest)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        app_service_1.AppService])
], CustomerRequestService);
//# sourceMappingURL=customer-request.service.js.map