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
exports.StockAlertService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stock_alert_entity_1 = require("./entities/stock-alert.entity");
const company_entity_1 = require("../company/entities/company.entity");
const model_entity_1 = require("../models/entities/model.entity");
const all_part_entity_1 = require("../all-parts/entities/all-part.entity");
const reference_entity_1 = require("../references/entities/reference.entity");
const stock_part_entity_1 = require("../stock-parts/entities/stock-part.entity");
const bin_entity_1 = require("../bin/entities/bin.entity");
const branch_entity_1 = require("../branches/entities/branch.entity");
const user_entity_1 = require("../users/entities/user.entity");
const repair_entity_1 = require("../repair/entities/repair.entity");
let StockAlertService = class StockAlertService {
    stockAlertRepo;
    companyRepo;
    modelRepo;
    allPartRepo;
    referenceRepo;
    stockPartRepo;
    binRepo;
    branchRepo;
    userRepo;
    repairRepo;
    constructor(stockAlertRepo, companyRepo, modelRepo, allPartRepo, referenceRepo, stockPartRepo, binRepo, branchRepo, userRepo, repairRepo) {
        this.stockAlertRepo = stockAlertRepo;
        this.companyRepo = companyRepo;
        this.modelRepo = modelRepo;
        this.allPartRepo = allPartRepo;
        this.referenceRepo = referenceRepo;
        this.stockPartRepo = stockPartRepo;
        this.binRepo = binRepo;
        this.branchRepo = branchRepo;
        this.userRepo = userRepo;
        this.repairRepo = repairRepo;
    }
    async getAlerts(branchId, userId, type) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['branch'],
        });
        if (!user)
            return [];
        const isAdmin = user.role?.some((r) => r === 'Administrateur');
        const hasRole = (role) => user.role?.some((r) => r === role) && user.branch?.id === branchId;
        if (!type) {
            if (!isAdmin && !hasRole('Gestionnaire_de_stocks') && !hasRole('Reception'))
                return [];
        }
        else if (type === 'stock') {
            if (!isAdmin && !hasRole('Gestionnaire_de_stocks'))
                return [];
        }
        else if (type === 'reception') {
            if (!isAdmin && !hasRole('Reception'))
                return [];
        }
        else if (type === 'affectation') {
            if (!isAdmin && !hasRole('Coordinateur'))
                return [];
        }
        else if (type === 'reparation') {
            if (!isAdmin && !hasRole('Technicien'))
                return [];
        }
        else if (type === 'cq') {
            if (!isAdmin && !hasRole('Coordinateur'))
                return [];
        }
        else if (type === 'bloque') {
            if (!isAdmin)
                return [];
        }
        const where = isAdmin ? {} : { branchId };
        if (type)
            where.type = type;
        const alerts = await this.stockAlertRepo.find({
            where,
            order: { createdAt: 'DESC' },
        });
        return alerts.map((a) => ({
            ...a,
            isRead: a.readBy?.includes(String(userId)) ?? false,
        }));
    }
    async markAsRead(alertId, userId) {
        const alert = await this.stockAlertRepo.findOneBy({ id: alertId });
        if (!alert)
            return null;
        const readSet = new Set(alert.readBy || []);
        readSet.add(String(userId));
        alert.readBy = [...readSet];
        return this.stockAlertRepo.save(alert);
    }
    async generateAlertForBranch(branchId) {
        const company = await this.companyRepo.findOne({ where: {} });
        if (!company)
            return null;
        const threshold = company.quantityAlertStock ?? 0;
        const models = await this.modelRepo.find({
            where: { brand: { status: 'Autoriser' } },
            relations: ['brand', 'allpart'],
        });
        const report = [];
        for (const model of models) {
            if (!model.allpart?.length)
                continue;
            for (const allPart of model.allpart) {
                const references = await this.referenceRepo.find({
                    where: { model: { id: model.id }, allpart: { id: allPart.id } },
                    relations: ['model', 'allpart'],
                });
                for (const ref of references) {
                    const count = await this.stockPartRepo.count({
                        where: {
                            reference: { id: ref.id },
                            bin: { type: 'Bon', branch: { id: branchId } },
                        },
                    });
                    if (count <= threshold) {
                        report.push({
                            brand: model.brand?.name ?? '',
                            model: model.name ?? '',
                            part: allPart.description ?? '',
                            quantity: count,
                        });
                    }
                }
            }
        }
        if (report.length === 0)
            return null;
        const alert = this.stockAlertRepo.create({
            branchId,
            report,
            readBy: [],
        });
        return this.stockAlertRepo.save(alert);
    }
    async generateForAllBranches() {
        const branches = await this.branchRepo.find();
        const results = [];
        for (const branch of branches) {
            const alert = await this.generateAlertForBranch(branch.id);
            if (alert)
                results.push(alert);
        }
        return results;
    }
    async generateReceptionAlertForBranch(branchId) {
        const repairs = await this.repairRepo
            .createQueryBuilder('repair')
            .leftJoinAndSelect('repair.historyRepair', 'historyRepair')
            .leftJoinAndSelect('repair.device', 'device')
            .leftJoinAndSelect('repair.customer', 'customer')
            .where('repair.actuellybranch = :branchId', { branchId })
            .getMany();
        const stuck = [];
        for (const repair of repairs) {
            if (!repair.historyRepair?.length)
                continue;
            const sorted = [...repair.historyRepair].sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
            const last = sorted[0];
            if (last.step !== 'Création')
                continue;
            stuck.push({
                repairId: repair.id,
                customerName: repair.customer?.name ?? '-',
                deviceModel: repair.device?.model?.name ?? '-',
                serialNumber: repair.device?.serialenumber ?? '-',
                creationDate: last.date,
            });
        }
        if (stuck.length <= 50)
            return null;
        const alert = this.stockAlertRepo.create({
            branchId,
            type: 'reception',
            report: stuck,
            readBy: [],
        });
        return this.stockAlertRepo.save(alert);
    }
    async generateReceptionForAllBranches() {
        const branches = await this.branchRepo.find();
        const results = [];
        for (const branch of branches) {
            const alert = await this.generateReceptionAlertForBranch(branch.id);
            if (alert)
                results.push(alert);
        }
        return results;
    }
    async generateAffectationAlertForBranch(branchId) {
        const repairs = await this.repairRepo
            .createQueryBuilder('repair')
            .leftJoinAndSelect('repair.historyRepair', 'historyRepair')
            .leftJoinAndSelect('repair.device', 'device')
            .leftJoinAndSelect('repair.customer', 'customer')
            .where('repair.actuellybranch = :branchId', { branchId })
            .getMany();
        const stuck = [];
        for (const repair of repairs) {
            if (!repair.historyRepair?.length)
                continue;
            const sorted = [...repair.historyRepair].sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
            const last = sorted[0];
            if (last.step !== 'On affectation')
                continue;
            stuck.push({
                repairId: repair.id,
                customerName: repair.customer?.name ?? '-',
                deviceModel: repair.device?.model?.name ?? '-',
                serialNumber: repair.device?.serialenumber ?? '-',
                creationDate: last.date,
            });
        }
        if (stuck.length <= 50)
            return null;
        const alert = this.stockAlertRepo.create({
            branchId,
            type: 'affectation',
            report: stuck,
            readBy: [],
        });
        return this.stockAlertRepo.save(alert);
    }
    async generateAffectationForAllBranches() {
        const branches = await this.branchRepo.find();
        const results = [];
        for (const branch of branches) {
            const alert = await this.generateAffectationAlertForBranch(branch.id);
            if (alert)
                results.push(alert);
        }
        return results;
    }
    async generateReparationAlertForBranch(branchId) {
        const repairs = await this.repairRepo
            .createQueryBuilder('repair')
            .leftJoinAndSelect('repair.historyRepair', 'historyRepair')
            .leftJoinAndSelect('repair.device', 'device')
            .leftJoinAndSelect('repair.customer', 'customer')
            .where('repair.actuellybranch = :branchId', { branchId })
            .getMany();
        const stuck = [];
        for (const repair of repairs) {
            if (!repair.historyRepair?.length)
                continue;
            const sorted = [...repair.historyRepair].sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
            const last = sorted[0];
            if (last.step !== 'On réparation')
                continue;
            stuck.push({
                repairId: repair.id,
                customerName: repair.customer?.name ?? '-',
                deviceModel: repair.device?.model?.name ?? '-',
                serialNumber: repair.device?.serialenumber ?? '-',
                creationDate: last.date,
            });
        }
        if (stuck.length <= 50)
            return null;
        const alert = this.stockAlertRepo.create({
            branchId,
            type: 'reparation',
            report: stuck,
            readBy: [],
        });
        return this.stockAlertRepo.save(alert);
    }
    async generateReparationForAllBranches() {
        const branches = await this.branchRepo.find();
        const results = [];
        for (const branch of branches) {
            const alert = await this.generateReparationAlertForBranch(branch.id);
            if (alert)
                results.push(alert);
        }
        return results;
    }
    async generateCqAlertForBranch(branchId) {
        const repairs = await this.repairRepo
            .createQueryBuilder('repair')
            .leftJoinAndSelect('repair.historyRepair', 'historyRepair')
            .leftJoinAndSelect('repair.device', 'device')
            .leftJoinAndSelect('repair.customer', 'customer')
            .where('repair.actuellybranch = :branchId', { branchId })
            .getMany();
        const stuck = [];
        for (const repair of repairs) {
            if (!repair.historyRepair?.length)
                continue;
            const sorted = [...repair.historyRepair].sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
            const last = sorted[0];
            if (last.step !== 'CQ')
                continue;
            stuck.push({
                repairId: repair.id,
                customerName: repair.customer?.name ?? '-',
                deviceModel: repair.device?.model?.name ?? '-',
                serialNumber: repair.device?.serialenumber ?? '-',
                creationDate: last.date,
            });
        }
        if (stuck.length <= 50)
            return null;
        const alert = this.stockAlertRepo.create({
            branchId,
            type: 'cq',
            report: stuck,
            readBy: [],
        });
        return this.stockAlertRepo.save(alert);
    }
    async generateCqForAllBranches() {
        const branches = await this.branchRepo.find();
        const results = [];
        for (const branch of branches) {
            const alert = await this.generateCqAlertForBranch(branch.id);
            if (alert)
                results.push(alert);
        }
        return results;
    }
    async generateBloqueAlertForBranch(branchId) {
        const stepsToCheck = ['Envoyé à affecter', 'Affecter', 'Envoyé à CQ', 'à rècuperer'];
        const repairs = await this.repairRepo
            .createQueryBuilder('repair')
            .leftJoinAndSelect('repair.historyRepair', 'historyRepair')
            .where('repair.actuellybranch = :branchId', { branchId })
            .getMany();
        const stepCounts = {};
        for (const step of stepsToCheck)
            stepCounts[step] = 0;
        for (const repair of repairs) {
            if (!repair.historyRepair?.length)
                continue;
            const sorted = [...repair.historyRepair].sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
            const last = sorted[0];
            if (stepsToCheck.includes(last.step ?? '')) {
                stepCounts[last.step] = (stepCounts[last.step] ?? 0) + 1;
            }
        }
        const report = [];
        for (const step of stepsToCheck) {
            if (stepCounts[step] > 50)
                report.push({ step, count: stepCounts[step] });
        }
        if (report.length === 0)
            return null;
        const alert = this.stockAlertRepo.create({
            branchId,
            type: 'bloque',
            report,
            readBy: [],
        });
        return this.stockAlertRepo.save(alert);
    }
    async generateBloqueForAllBranches() {
        const branches = await this.branchRepo.find();
        const results = [];
        for (const branch of branches) {
            const alert = await this.generateBloqueAlertForBranch(branch.id);
            if (alert)
                results.push(alert);
        }
        return results;
    }
    async weeklyStockAlert() {
        return this.generateForAllBranches();
    }
    async dailyReceptionAlert() {
        const branches = await this.branchRepo.find();
        for (const branch of branches) {
            await this.generateReceptionAlertForBranch(branch.id);
        }
    }
    async dailyAffectationAlert() {
        const branches = await this.branchRepo.find();
        for (const branch of branches) {
            await this.generateAffectationAlertForBranch(branch.id);
        }
    }
    async dailyReparationAlert() {
        const branches = await this.branchRepo.find();
        for (const branch of branches) {
            await this.generateReparationAlertForBranch(branch.id);
        }
    }
    async dailyCqAlert() {
        const branches = await this.branchRepo.find();
        for (const branch of branches) {
            await this.generateCqAlertForBranch(branch.id);
        }
    }
    async dailyBloqueAlert() {
        const branches = await this.branchRepo.find();
        for (const branch of branches) {
            await this.generateBloqueAlertForBranch(branch.id);
        }
    }
    async findAlertById(id) {
        return this.stockAlertRepo.findOneBy({ id });
    }
    async getAlertUsers(branchId) {
        const users = await this.userRepo.find({
            where: { branch: { id: branchId } },
        });
        const admins = await this.userRepo.find();
        const stockManagers = users.filter((u) => u.role?.some((r) => r === 'Gestionnaire_de_stocks'));
        const adminsAll = admins.filter((u) => u.role?.some((r) => r === 'Administrateur'));
        const seen = new Set();
        return [...stockManagers, ...adminsAll].filter((u) => {
            if (u.id == null)
                return false;
            if (seen.has(u.id))
                return false;
            seen.add(u.id);
            return true;
        });
    }
};
exports.StockAlertService = StockAlertService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_WEEKEND),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StockAlertService.prototype, "weeklyStockAlert", null);
__decorate([
    (0, schedule_1.Cron)('0 15 8 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StockAlertService.prototype, "dailyReceptionAlert", null);
__decorate([
    (0, schedule_1.Cron)('0 15 8 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StockAlertService.prototype, "dailyAffectationAlert", null);
__decorate([
    (0, schedule_1.Cron)('0 15 8 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StockAlertService.prototype, "dailyReparationAlert", null);
__decorate([
    (0, schedule_1.Cron)('0 15 8 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StockAlertService.prototype, "dailyCqAlert", null);
__decorate([
    (0, schedule_1.Cron)('0 15 8 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StockAlertService.prototype, "dailyBloqueAlert", null);
exports.StockAlertService = StockAlertService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stock_alert_entity_1.StockAlert)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __param(2, (0, typeorm_1.InjectRepository)(model_entity_1.Model)),
    __param(3, (0, typeorm_1.InjectRepository)(all_part_entity_1.AllPart)),
    __param(4, (0, typeorm_1.InjectRepository)(reference_entity_1.Reference)),
    __param(5, (0, typeorm_1.InjectRepository)(stock_part_entity_1.StockPart)),
    __param(6, (0, typeorm_1.InjectRepository)(bin_entity_1.Bin)),
    __param(7, (0, typeorm_1.InjectRepository)(branch_entity_1.Branch)),
    __param(8, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(9, (0, typeorm_1.InjectRepository)(repair_entity_1.Repair)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StockAlertService);
//# sourceMappingURL=stock-alert.service.js.map