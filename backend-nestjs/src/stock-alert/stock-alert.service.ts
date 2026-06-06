import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { StockAlert } from './entities/stock-alert.entity';
import { Company } from 'src/company/entities/company.entity';
import { Model } from 'src/models/entities/model.entity';
import { AllPart } from 'src/all-parts/entities/all-part.entity';
import { Reference } from 'src/references/entities/reference.entity';
import { StockPart } from 'src/stock-parts/entities/stock-part.entity';
import { Bin } from 'src/bin/entities/bin.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { User } from 'src/users/entities/user.entity';
import { Repair } from 'src/repair/entities/repair.entity';

@Injectable()
export class StockAlertService {
  constructor(
    @InjectRepository(StockAlert)
    private stockAlertRepo: Repository<StockAlert>,
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
    @InjectRepository(Model)
    private modelRepo: Repository<Model>,
    @InjectRepository(AllPart)
    private allPartRepo: Repository<AllPart>,
    @InjectRepository(Reference)
    private referenceRepo: Repository<Reference>,
    @InjectRepository(StockPart)
    private stockPartRepo: Repository<StockPart>,
    @InjectRepository(Bin)
    private binRepo: Repository<Bin>,
    @InjectRepository(Branch)
    private branchRepo: Repository<Branch>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Repair)
    private repairRepo: Repository<Repair>,
  ) {}

  async getAlerts(branchId: number, userId: number, type?: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['branch'],
    });
    if (!user) return [];

    const isAdmin = user.role?.some((r) => r === 'Administrateur');
    const hasRole = (role: string) =>
      user.role?.some((r) => r === role) && user.branch?.id === branchId;

    if (!type) {
      if (!isAdmin && !hasRole('Gestionnaire_de_stocks') && !hasRole('Reception')) return [];
    } else if (type === 'stock') {
      if (!isAdmin && !hasRole('Gestionnaire_de_stocks')) return [];
    } else if (type === 'reception') {
      if (!isAdmin && !hasRole('Reception')) return [];
    } else if (type === 'affectation') {
      if (!isAdmin && !hasRole('Coordinateur')) return [];
    } else if (type === 'reparation') {
      if (!isAdmin && !hasRole('Technicien')) return [];
    } else if (type === 'cq') {
      if (!isAdmin && !hasRole('Coordinateur')) return [];
    } else if (type === 'bloque') {
      if (!isAdmin) return [];
    }

    const where: any = isAdmin ? {} : { branchId };
    if (type) where.type = type;
    const alerts = await this.stockAlertRepo.find({
      where,
      relations: ['branch'],
      order: { createdAt: 'DESC' },
    });
    return alerts.map((a) => ({
      ...a,
      branchName: a.branch?.name ?? `Agence ${a.branchId}`,
      isRead: a.readBy?.includes(String(userId)) ?? false,
    }));
  }

  async markAsRead(alertId: number, userId: number) {
    const alert = await this.stockAlertRepo.findOneBy({ id: alertId });
    if (!alert) return null;
    const readSet = new Set(alert.readBy || []);
    readSet.add(String(userId));
    alert.readBy = [...readSet];
    return this.stockAlertRepo.save(alert);
  }

  async generateAlertForBranch(branchId: number) {
    const company = await this.companyRepo.findOne({ where: {} });
    if (!company) return null;
    const threshold = company.quantityAlertStock ?? 0;

    const models = await this.modelRepo.find({
      where: { brand: { status: 'Autoriser' } },
      relations: ['brand', 'allpart'],
    });

    const report: { brand: string; model: string; part: string; quantity: number }[] = [];

    for (const model of models) {
      if (!model.allpart?.length) continue;

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

    if (report.length === 0) return null;

    const alert = this.stockAlertRepo.create({
      branchId,
      report,
      readBy: [],
    });
    return this.stockAlertRepo.save(alert);
  }

  async generateForAllBranches() {
    const branches = await this.branchRepo.find();
    const results: StockAlert[] = [];
    for (const branch of branches) {
      const alert = await this.generateAlertForBranch(branch.id);
      if (alert) results.push(alert);
    }
    return results;
  }

  async generateReceptionAlertForBranch(branchId: number) {
    const repairs = await this.repairRepo
      .createQueryBuilder('repair')
      .leftJoinAndSelect('repair.historyRepair', 'historyRepair')
      .leftJoinAndSelect('repair.device', 'device')
      .leftJoinAndSelect('repair.customer', 'customer')
      .where('repair.actuellybranch = :branchId', { branchId })
      .getMany();

    const stuck: {
      repairId: number;
      customerName: string;
      deviceModel: string;
      serialNumber: string;
      creationDate: Date;
    }[] = [];

    for (const repair of repairs) {
      if (!repair.historyRepair?.length) continue;
      const sorted = [...repair.historyRepair].sort(
        (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
      );
      const last = sorted[0];
      if (last.step !== 'Création') continue;
      stuck.push({
        repairId: repair.id,
        customerName: repair.customer?.name ?? '-',
        deviceModel: repair.device?.model?.name ?? '-',
        serialNumber: repair.device?.serialenumber ?? '-',
        creationDate: last.date!,
      });
    }

    if (stuck.length <= 50) return null;

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
    const results: StockAlert[] = [];
    for (const branch of branches) {
      const alert = await this.generateReceptionAlertForBranch(branch.id);
      if (alert) results.push(alert);
    }
    return results;
  }

  async generateAffectationAlertForBranch(branchId: number) {
    const repairs = await this.repairRepo
      .createQueryBuilder('repair')
      .leftJoinAndSelect('repair.historyRepair', 'historyRepair')
      .leftJoinAndSelect('repair.device', 'device')
      .leftJoinAndSelect('repair.customer', 'customer')
      .where('repair.actuellybranch = :branchId', { branchId })
      .getMany();

    const stuck: {
      repairId: number;
      customerName: string;
      deviceModel: string;
      serialNumber: string;
      creationDate: Date;
    }[] = [];

    for (const repair of repairs) {
      if (!repair.historyRepair?.length) continue;
      const sorted = [...repair.historyRepair].sort(
        (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
      );
      const last = sorted[0];
      if (last.step !== 'On affectation') continue;
      stuck.push({
        repairId: repair.id,
        customerName: repair.customer?.name ?? '-',
        deviceModel: repair.device?.model?.name ?? '-',
        serialNumber: repair.device?.serialenumber ?? '-',
        creationDate: last.date!,
      });
    }

    if (stuck.length <= 50) return null;

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
    const results: StockAlert[] = [];
    for (const branch of branches) {
      const alert = await this.generateAffectationAlertForBranch(branch.id);
      if (alert) results.push(alert);
    }
    return results;
  }

  async generateReparationAlertForBranch(branchId: number) {
    const repairs = await this.repairRepo
      .createQueryBuilder('repair')
      .leftJoinAndSelect('repair.historyRepair', 'historyRepair')
      .leftJoinAndSelect('repair.device', 'device')
      .leftJoinAndSelect('repair.customer', 'customer')
      .where('repair.actuellybranch = :branchId', { branchId })
      .getMany();

    const stuck: {
      repairId: number;
      customerName: string;
      deviceModel: string;
      serialNumber: string;
      creationDate: Date;
    }[] = [];

    for (const repair of repairs) {
      if (!repair.historyRepair?.length) continue;
      const sorted = [...repair.historyRepair].sort(
        (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
      );
      const last = sorted[0];
      if (last.step !== 'On réparation') continue;
      stuck.push({
        repairId: repair.id,
        customerName: repair.customer?.name ?? '-',
        deviceModel: repair.device?.model?.name ?? '-',
        serialNumber: repair.device?.serialenumber ?? '-',
        creationDate: last.date!,
      });
    }

    if (stuck.length <= 50) return null;

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
    const results: StockAlert[] = [];
    for (const branch of branches) {
      const alert = await this.generateReparationAlertForBranch(branch.id);
      if (alert) results.push(alert);
    }
    return results;
  }

  async generateCqAlertForBranch(branchId: number) {
    const repairs = await this.repairRepo
      .createQueryBuilder('repair')
      .leftJoinAndSelect('repair.historyRepair', 'historyRepair')
      .leftJoinAndSelect('repair.device', 'device')
      .leftJoinAndSelect('repair.customer', 'customer')
      .where('repair.actuellybranch = :branchId', { branchId })
      .getMany();

    const stuck: {
      repairId: number;
      customerName: string;
      deviceModel: string;
      serialNumber: string;
      creationDate: Date;
    }[] = [];

    for (const repair of repairs) {
      if (!repair.historyRepair?.length) continue;
      const sorted = [...repair.historyRepair].sort(
        (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
      );
      const last = sorted[0];
      if (last.step !== 'CQ') continue;
      stuck.push({
        repairId: repair.id,
        customerName: repair.customer?.name ?? '-',
        deviceModel: repair.device?.model?.name ?? '-',
        serialNumber: repair.device?.serialenumber ?? '-',
        creationDate: last.date!,
      });
    }

    if (stuck.length <= 50) return null;

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
    const results: StockAlert[] = [];
    for (const branch of branches) {
      const alert = await this.generateCqAlertForBranch(branch.id);
      if (alert) results.push(alert);
    }
    return results;
  }

  async generateBloqueAlertForBranch(branchId: number) {
    const stepsToCheck = ['Envoyé à affecter', 'Affecter', 'Envoyé à CQ', 'à rècuperer'];
    const repairs = await this.repairRepo
      .createQueryBuilder('repair')
      .leftJoinAndSelect('repair.historyRepair', 'historyRepair')
      .where('repair.actuellybranch = :branchId', { branchId })
      .getMany();

    const stepCounts: Record<string, number> = {};
    for (const step of stepsToCheck) stepCounts[step] = 0;

    for (const repair of repairs) {
      if (!repair.historyRepair?.length) continue;
      const sorted = [...repair.historyRepair].sort(
        (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
      );
      const last = sorted[0];
      if (stepsToCheck.includes(last.step ?? '')) {
        stepCounts[last.step!] = (stepCounts[last.step!] ?? 0) + 1;
      }
    }

    const report: { step: string; count: number }[] = [];
    for (const step of stepsToCheck) {
      if (stepCounts[step] > 50) report.push({ step, count: stepCounts[step] });
    }

    if (report.length === 0) return null;

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
    const results: StockAlert[] = [];
    for (const branch of branches) {
      const alert = await this.generateBloqueAlertForBranch(branch.id);
      if (alert) results.push(alert);
    }
    return results;
  }

  @Cron(CronExpression.EVERY_WEEKEND)
  async weeklyStockAlert() {
    return this.generateForAllBranches();
  }

  @Cron('0 15 8 * * *')
  async dailyReceptionAlert() {
    const branches = await this.branchRepo.find();
    for (const branch of branches) {
      await this.generateReceptionAlertForBranch(branch.id);
    }
  }

  @Cron('0 15 8 * * *')
  async dailyAffectationAlert() {
    const branches = await this.branchRepo.find();
    for (const branch of branches) {
      await this.generateAffectationAlertForBranch(branch.id);
    }
  }

  @Cron('0 15 8 * * *')
  async dailyReparationAlert() {
    const branches = await this.branchRepo.find();
    for (const branch of branches) {
      await this.generateReparationAlertForBranch(branch.id);
    }
  }

  @Cron('0 15 8 * * *')
  async dailyCqAlert() {
    const branches = await this.branchRepo.find();
    for (const branch of branches) {
      await this.generateCqAlertForBranch(branch.id);
    }
  }

  @Cron('0 15 8 * * *')
  async dailyBloqueAlert() {
    const branches = await this.branchRepo.find();
    for (const branch of branches) {
      await this.generateBloqueAlertForBranch(branch.id);
    }
  }

  async findAlertById(id: number) {
    return this.stockAlertRepo.findOneBy({ id });
  }

  async getAlertUsers(branchId: number) {
    const users = await this.userRepo.find({
      where: { branch: { id: branchId } },
    });
    const admins = await this.userRepo.find();
    const stockManagers = users.filter(
      (u) => u.role?.some((r) => r === 'Gestionnaire_de_stocks'),
    );
    const adminsAll = admins.filter((u) =>
      u.role?.some((r) => r === 'Administrateur'),
    );
    const seen = new Set<number>();
    return [...stockManagers, ...adminsAll].filter((u) => {
      if (u.id == null) return false;
      if (seen.has(u.id)) return false;
      seen.add(u.id);
      return true;
    });
  }
}
