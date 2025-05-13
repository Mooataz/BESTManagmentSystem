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
exports.OutputListService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const output_list_entity_1 = require("./entities/output-list.entity");
const typeorm_2 = require("typeorm");
const repair_entity_1 = require("../repair/entities/repair.entity");
const customer_entity_1 = require("../customers/entities/customer.entity");
const user_entity_1 = require("../users/entities/user.entity");
let OutputListService = class OutputListService {
    outputListRepositry;
    repairRepository;
    customerRepository;
    userRepository;
    constructor(outputListRepositry, repairRepository, customerRepository, userRepository) {
        this.outputListRepositry = outputListRepositry;
        this.repairRepository = repairRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }
    async create(createOutputListDto) {
        const repair = await this.repairRepository.find({
            where: { id: (0, typeorm_2.In)(createOutputListDto.repairIds) }
        });
        if (!repair.length) {
            throw new common_1.NotFoundException('No repair data found');
        }
        const customer = await this.customerRepository.findOne({
            where: { id: createOutputListDto.customer }
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const user = await this.userRepository.findOne({
            where: { id: createOutputListDto.user }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const newCreate = this.outputListRepositry.create({
            ...createOutputListDto,
            repair,
            customer,
            user
        });
        return await this.outputListRepositry.save(newCreate);
    }
    async findAll() {
        const allfind = await this.outputListRepositry.find();
        if (!allfind || allfind.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return allfind;
    }
    async findOne(id) {
        const Onefin = await this.outputListRepositry.findOne({ where: { id } });
        if (!Onefin) {
            throw new common_1.NotFoundException("There is no user data Available");
        }
        return Onefin;
    }
    async findByBranchId(branchId) {
        const findAll = await this.outputListRepositry
            .createQueryBuilder("outputList")
            .leftJoinAndSelect("outputList.user", "user")
            .where("user.branch = :branchId", { branchId })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findByUserId(userId) {
        const findAll = await this.outputListRepositry
            .createQueryBuilder("outputList")
            .leftJoinAndSelect("outputList.user", "user")
            .where("user.id = :userId", { userId })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async findByCustomerId(customerId) {
        const findAll = await this.outputListRepositry
            .createQueryBuilder("outputList")
            .leftJoinAndSelect("outputList.customer", "customer")
            .where("customer.id = :customerId", { customerId })
            .getMany();
        if (!findAll || findAll.length === 0) {
            throw new common_1.NotFoundException("There is no data Available");
        }
        return findAll;
    }
    async remove(id) {
        const deletedata = await this.outputListRepositry.findOne({ where: { id } });
        if (!deletedata) {
            throw new common_1.NotFoundException('data Not found for delete = failed');
        }
        await this.outputListRepositry.delete({ id: deletedata.id });
        return deletedata;
    }
};
exports.OutputListService = OutputListService;
exports.OutputListService = OutputListService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(output_list_entity_1.OutputList)),
    __param(1, (0, typeorm_1.InjectRepository)(repair_entity_1.Repair)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OutputListService);
//# sourceMappingURL=output-list.service.js.map